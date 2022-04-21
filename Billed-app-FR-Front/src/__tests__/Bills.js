/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import '@testing-library/jest-dom/extend-expect'
jest.mock("../__mocks__/store");

import router from "../app/Router.js";
import { formatDate } from "../app/format.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass('active-icon')

    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({
        data: bills
      })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
  describe("Given I am connected as Employee and I am on Bills page", () => {
    describe("When I click on eye icon", () => {
      test("A modal should open", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );
        document.body.innerHTML = BillsUI({
          data: [bills[0]]
        });
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({
            pathname
          });
        };
        const store = null;
        const b = new Bills({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });
        $.fn.modal = jest.fn();
        const eye = screen.getByTestId("icon-eye");


        const handleClickIconEye = jest.fn(b.handleClickIconEye(eye));
        eye.addEventListener("click", handleClickIconEye);

        userEvent.click(eye);
        expect(handleClickIconEye).toHaveBeenCalled();
      })
    })
  })
  describe('When I am on Bills page and I click on new bill button', () => {
    test('Then, a new bill form should be opened', () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };

      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
      });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }));

      const bill = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleClickNewBill = jest.fn((e) => bill.handleClickNewBill());
      // const buttonNewBill = document.querySelectorAll('[data-testid="btn-new-bill"]');
      const buttonNewBill = screen.getByTestId("btn-new-bill");

        buttonNewBill.addEventListener('click', handleClickNewBill);
        userEvent.click(buttonNewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
        expect(screen.getByTestId('form-new-bill')).toBeTruthy();
 
    });
  });
});



describe('Given I m connected as Employee', () => {
  describe('When i on bills page', () => {
    test('fetch bill from api get', async () => {
      localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'a@a'}));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await formatDate(())
    })
  })
}

})