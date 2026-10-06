#### Script for automated testing, edge cases, error handling, and performance

import csv
import re
import csv
import socket
import subprocess
import sys
import time
from pathlib import Path
from urllib.error import URLError
from urllib.request import urlopen

import pytest
from playwright.sync_api import Page, expect


PROJECT_ROOT = Path(__file__).resolve().parent


@pytest.fixture(scope="session")
def app_url():
    # Pick an available port so the app's server doesn't conflict with another one.
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]

    url = f"http://127.0.0.1:{port}/"
    server = subprocess.Popen(
        [
            sys.executable,
            "-m",
            "http.server",
            str(port),
            "--bind",
            "127.0.0.1",
        ],
        cwd=PROJECT_ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline:
            if server.poll() is not None:
                raise RuntimeError("The local test server stopped unexpectedly.")

            try:
                with urlopen(url, timeout=1):
                    break
            except (OSError, URLError):
                time.sleep(0.1)
        else:
            raise RuntimeError("The local test server did not start in time.")

        yield url
    finally:
        if server.poll() is None:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()
                server.wait()


@pytest.fixture
def clean_page(page: Page, app_url: str) -> Page:
    # Clear saved Found checkboxes, then reload so the app starts with clean state.
    page.goto(app_url)
    page.evaluate("localStorage.clear()")
    page.reload()
    return page


def open_species_page(page: Page) -> None:
    page.locator(".season-wedge").first.click(force=True)
    page.locator(".ilua-node").first.click(force=True)
    page.locator(".category-card").first.click(force=True)
    expect(page.locator("#found-filter")).to_be_visible()


def replace_csv_response(page: Page, filename: str, body: str, status: int = 200) -> None:
    page.route(
        f"**/{filename}",
        lambda route: route.fulfill(
            status=status,
            content_type="text/csv",
            body=body,
        ),
    )


def test_season_wheel_loads_six_seasons(clean_page: Page) -> None:
    expect(clean_page.locator(".season-wedge")).to_have_count(6)


def test_home_found_species_button_opens_empty_state(clean_page: Page) -> None:
    button = clean_page.get_by_role(
        "button",
        name="View all species found to date",
    )
    expect(button).to_be_visible()
    button.click()

    expect(clean_page.get_by_role("heading", name="Species Found to Date")).to_be_visible()
    expect(clean_page.locator(".empty-state")).to_have_text(
        "No species have been marked Found yet."
    )
    expect(clean_page.locator("#found-to-date-count")).to_have_text(
        re.compile(r"Species found to date: 0 of [1-9]\d*")
    )
    expect(clean_page.locator("#found-filter")).to_have_count(0)


def test_found_to_date_list_includes_all_categories_and_updates_when_unchecked(
    clean_page: Page,
) -> None:
    sources = [
        ("bush_food", "Bush Food", "bush_food_data_master.csv"),
        ("bush_medicine", "Bush Medicine", "bush_med_data_master.csv"),
        ("wildflower", "Wildflowers", "wildflower_data_master.csv"),
    ]
    found_records = []
    total_species = 0
    for category, label, filename in sources:
        with (PROJECT_ROOT / filename).open(
            encoding="utf-8-sig", newline=""
        ) as csv_file:
            rows = list(csv.DictReader(csv_file))
        total_species += len(rows)
        row = rows[0]
        found_records.append((row["species_id"], row["species_name"], label))

    found_state = {species_id: True for species_id, _, _ in found_records}
    clean_page.evaluate(
        "(state) => localStorage.setItem('noongarPlantFinderChecked', JSON.stringify(state))",
        found_state,
    )
    clean_page.reload()
    clean_page.get_by_role("button", name="View all species found to date").click()
    expect(clean_page.locator("#found-to-date-count")).to_have_text(
        f"Species found to date: {len(found_records)} of {total_species}"
    )

    displayed_names = clean_page.locator(".species-body h3").all_text_contents()
    assert displayed_names == sorted(
        (name for _, name, _ in found_records),
        key=str.casefold,
    )
    expect(clean_page.locator("#found-filter")).to_have_count(0)
    expect(clean_page.locator(".selection-summary")).to_have_count(0)

    for species_id, _, category_label in found_records:
        card = clean_page.locator(
            ".species-card",
            has=clean_page.locator(f'[data-species-id="{species_id}"]'),
        )
        expect(card.locator(".species-category")).to_have_text(category_label)
        expect(card.locator(".found-toggle input")).to_be_checked()

    clean_page.locator(".found-toggle input").first.evaluate(
        "(checkbox) => checkbox.click()"
    )
    expect(clean_page.locator(".species-card")).to_have_count(2)
    expect(clean_page.locator(".found-toggle input:checked")).to_have_count(2)
    expect(clean_page.locator("#found-to-date-count")).to_have_text(
        f"Species found to date: 2 of {total_species}"
    )


def test_navigation_reaches_species_list(clean_page: Page) -> None:
    open_species_page(clean_page)

    expect(clean_page.locator(".selection-summary")).to_be_visible()
    expect(clean_page.locator("#found-filter")).to_have_value("all")
    expect(clean_page.locator(".species-card").first).to_be_visible()
    expect(clean_page.locator("#species-found-count")).to_contain_text(
        "Species found: 0 of "
    )


def test_species_found_count_updates_without_changing_the_total(
    clean_page: Page,
) -> None:
    open_species_page(clean_page)

    count_label = clean_page.locator("#species-found-count")
    initial_count = count_label.inner_text()
    total_species = int(initial_count.rsplit(" ", 1)[1])
    assert total_species > 0

    clean_page.locator(".found-toggle input").first.check()
    expect(count_label).to_have_text(f"Species found: 1 of {total_species}")

    clean_page.locator("#found-filter").select_option("found")
    expect(count_label).to_have_text(f"Species found: 1 of {total_species}")


def test_species_are_sorted_alphabetically(clean_page: Page) -> None:
    open_species_page(clean_page)

    names = clean_page.locator(".species-body h3").all_text_contents()
    assert names == sorted(names, key=str.casefold)


def test_found_filter_shows_empty_message_when_none_are_found(
    clean_page: Page,
) -> None:
    open_species_page(clean_page)
    clean_page.locator("#found-filter").select_option("found")

    expect(clean_page.locator(".empty-state")).to_contain_text(
        "No species marked Found"
    )


def test_not_found_filter_only_shows_unchecked_species(
    clean_page: Page,
) -> None:
    open_species_page(clean_page)
    clean_page.locator("#found-filter").select_option("not-found")

    assert clean_page.locator(".species-card").count() > 0
    expect(clean_page.locator(".found-toggle input:checked")).to_have_count(0)


def test_checking_species_removes_it_from_not_found_filter(
    clean_page: Page,
) -> None:
    open_species_page(clean_page)
    clean_page.locator("#found-filter").select_option("not-found")

    first_checkbox = clean_page.locator(".found-toggle input").first
    first_name = clean_page.locator(".species-body h3").first.inner_text()
    first_checkbox.evaluate("(checkbox) => checkbox.click()")

    clean_page.locator("#found-filter").select_option("found")
    expect(
        clean_page.locator(".species-body h3", has_text=first_name)
    ).to_be_visible()


def test_found_checkbox_persists_after_reload(
    clean_page: Page,
) -> None:
    open_species_page(clean_page)

    first_name = clean_page.locator(".species-body h3").first.inner_text()
    clean_page.locator(".found-toggle input").first.check()
    clean_page.reload()

    open_species_page(clean_page)
    clean_page.locator("#found-filter").select_option("found")
    expect(
        clean_page.locator(".species-body h3", has_text=first_name)
    ).to_be_visible()


def test_malformed_saved_state_does_not_break_startup(
    clean_page: Page,
) -> None:
    clean_page.evaluate(
        "localStorage.setItem('noongarPlantFinderChecked', '{invalid json')"
    )
    clean_page.reload()

    expect(clean_page.locator(".season-wedge")).to_have_count(6)


def test_csv_network_failure_shows_load_error(
    clean_page: Page,
    app_url: str,
) -> None:
    clean_page.route(
        "**/season_data_master.csv",
        lambda route: route.abort(),
    )
    clean_page.goto(app_url)

    expect(clean_page.get_by_text("Data could not be loaded.")).to_be_visible()


def test_csv_http_error_shows_load_error(clean_page: Page, app_url: str) -> None:
    replace_csv_response(clean_page, "season_data_master.csv", "Not found", status=404)
    clean_page.goto(app_url)

    expect(clean_page.get_by_text("Data could not be loaded.")).to_be_visible()


def test_empty_csv_shows_load_error(clean_page: Page, app_url: str) -> None:
    replace_csv_response(clean_page, "season_data_master.csv", "")
    clean_page.goto(app_url)

    expect(clean_page.get_by_text("Data could not be loaded.")).to_be_visible()


def test_csv_missing_required_columns_shows_load_error(
    clean_page: Page,
    app_url: str,
) -> None:
    replace_csv_response(clean_page, "season_data_master.csv", "season_name\nBirak")
    clean_page.goto(app_url)

    expect(clean_page.get_by_text("Data could not be loaded.")).to_be_visible()


def test_malformed_csv_shows_load_error(clean_page: Page, app_url: str) -> None:
    malformed_csv = (
        "season_id,season_name,season_info1,season_info2,season_months,season_weather\n"
        's1,"Birak,Young season,First summer,Dec-Jan,Hot'
    )
    replace_csv_response(clean_page, "season_data_master.csv", malformed_csv)
    clean_page.goto(app_url)

    expect(clean_page.get_by_text("Data could not be loaded.")).to_be_visible()


def test_failed_photo_uses_placeholder(clean_page: Page) -> None:
    clean_page.route("**/species_photos/**", lambda route: route.abort())
    open_species_page(clean_page)

    first_photo = clean_page.locator(".species-photo").first
    expect(first_photo).to_have_attribute("src", re.compile(r"^data:image/svg\+xml"))


def test_species_with_missing_optional_fields_use_fallbacks(
    clean_page: Page,
) -> None:
    headers = [
        "species_id",
        "species_name",
        "category",
        "i6",
        "i5",
        "i1",
        "i2",
        "i3",
        "i4",
        "s1",
        "s2",
        "s3",
        "s4",
        "s5",
        "s6",
    ]
    values = {header: "" for header in headers}
    values.update(
        {
            "species_id": "test-species",
            "species_name": "Test plant",
            "category": "bush_food",
            "i1": "y",
            "s1": "y",
        }
    )
    csv_body = ",".join(headers) + "\n" + ",".join(values[header] for header in headers)
    replace_csv_response(clean_page, "bush_food_data_master.csv", csv_body)
    clean_page.reload()
    open_species_page(clean_page)

    expect(clean_page.locator(".species-body h3")).to_have_text("Test plant")
    expect(clean_page.locator(".common-name")).to_have_text("No common name recorded")
    expect(clean_page.locator(".species-body")).to_contain_text("Noongar name: Not recorded")
    expect(clean_page.locator(".species-body")).to_contain_text(
        "No information supplied."
    )
    expect(clean_page.locator(".species-photo")).to_have_attribute(
        "src", re.compile(r"^data:image/svg\+xml")
    )


def test_storage_write_failure_is_announced_without_crashing(
    clean_page: Page,
) -> None:
    open_species_page(clean_page)
    page_errors = []
    clean_page.on("pageerror", lambda error: page_errors.append(str(error)))
    clean_page.evaluate(
        """() => {
          const originalSetItem = Storage.prototype.setItem;
          Storage.prototype.setItem = function (key, value) {
            if (key === 'noongarPlantFinderChecked') {
              throw new DOMException('Storage quota exceeded', 'QuotaExceededError');
            }
            return originalSetItem.call(this, key, value);
          };
        }"""
    )

    clean_page.locator(".found-toggle input").first.evaluate(
        "(checkbox) => checkbox.click()"
    )

    expect(clean_page.get_by_role("status")).to_contain_text(
        "could not be saved on this device"
    )
    assert page_errors == []


def test_every_season_area_category_combination_renders(
    clean_page: Page,
) -> None:
    categories = [
        ("bush_food", "Bush Food", "bush_food_data_master.csv"),
        ("bush_medicine", "Bush Medicine", "bush_med_data_master.csv"),
        ("wildflower", "Wildflowers", "wildflower_data_master.csv"),
    ]
    species_rows = []
    for category, _, filename in categories:
        with (PROJECT_ROOT / filename).open(
            encoding="utf-8-sig", newline=""
        ) as csv_file:
            species_rows.extend(
                (category, row) for row in csv.DictReader(csv_file)
            )

    season_ids = [f"s{index}" for index in range(1, 7)]
    ilua_ids = [f"i{index}" for index in range(1, 7)]
    combinations_checked = 0

    for season_index, season_id in enumerate(season_ids):
        for ilua_index, ilua_id in enumerate(ilua_ids):
            for category_index, (category, category_label, _) in enumerate(categories):
                if combinations_checked:
                    clean_page.get_by_role("button", name="Home").click(force=True)

                clean_page.locator(".season-wedge").nth(season_index).click(force=True)
                clean_page.locator(".ilua-node").nth(ilua_index).click(force=True)
                clean_page.locator(".category-card").nth(category_index).click(force=True)

                expect(clean_page.locator(".species-list")).to_be_visible()
                expect(clean_page.locator(".selection-summary")).to_contain_text(
                    category_label
                )
                expected_species = sorted(
                    (
                        row.get("species_name") or "Unknown species"
                        for row_category, row in species_rows
                        if row_category == category
                        and row.get(season_id, "").lower() == "y"
                        and row.get(ilua_id, "").lower() == "y"
                    ),
                    key=str.casefold,
                )
                actual_species = clean_page.locator(
                    ".species-body h3"
                ).all_text_contents()
                assert actual_species == expected_species, (
                    f"Species mismatch for season={season_id}, "
                    f"ILUA={ilua_id}, category={category}. "
                    f"Expected {expected_species}; got {actual_species}."
                )
                expect(clean_page.locator("#species-found-count")).to_have_text(
                    f"Species found: 0 of {len(expected_species)}"
                )

                if expected_species:
                    expect(clean_page.locator(".empty-state")).to_have_count(0)
                else:
                    expect(clean_page.locator(".empty-state")).to_be_visible()
                combinations_checked += 1

    assert combinations_checked == len(season_ids) * len(ilua_ids) * len(categories)


def test_back_and_home_navigation_work(clean_page: Page) -> None:
    open_species_page(clean_page)

    clean_page.get_by_role("button", name="Go back").click(force=True)
    expect(clean_page.locator(".category-card")).to_have_count(3)

    clean_page.get_by_role("button", name="Home").click(force=True)
    expect(clean_page.locator(".season-wedge")).to_have_count(6)


def test_main_navigation_has_no_uncaught_javascript_errors(
    clean_page: Page,
) -> None:
    errors = []
    clean_page.on("pageerror", lambda error: errors.append(str(error)))

    open_species_page(clean_page)

    assert errors == []