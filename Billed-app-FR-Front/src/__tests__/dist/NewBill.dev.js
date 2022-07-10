"use strict";

var _dom = require("@testing-library/dom");

require("@testing-library/jest-dom/extend-expect");

var _NewBillUI = _interopRequireDefault(require("../views/NewBillUI.js"));

var _NewBill = _interopRequireDefault(require("../containers/NewBill.js"));

var _Router = _interopRequireDefault(require("../app/Router.js"));

var _routes = require("../constants/routes.js");

var _localStorage = require("../__mocks__/localStorage.js");

var _store = _interopRequireDefault(require("../__mocks__/store"));

var _jestDom = require("@testing-library/jest-dom");

var _userEvent = _interopRequireDefault(require("@testing-library/user-event"));

var _store2 = _interopRequireDefault(require("../__mocks__/store.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @jest-environment jsdom
 */
jest.mock("../__mocks__/store");
describe("Given I am connected as an employee", function () {
  describe("When I am on NewBill Page", function () {
    test("Then ...", function () {
      var html = (0, _NewBillUI["default"])();
      document.body.innerHTML = html; //to-do write assertion

      var container = _dom.screen.getByTestId('form-newbill-container');

      expect(_dom.screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    });
    test("A modal should open ", function () {
      Object.defineProperty(window, 'localStorage', {
        value: _localStorage.localStorageMock
      });
      var user = JSON.stringify({
        type: 'Employee'
      });
      window.localStorage.setItem('user', user);

      var onNavigate = function onNavigate(pathname) {
        document.body.innerHTML = (0, _routes.ROUTES)({
          pathname: pathname
        });
      };

      var store = null;
      Object.defineProperty(window, 'localStorage', {
        value: _localStorage.localStorageMock
      });
      var newbill = new _NewBill["default"]({
        document: document,
        onNavigate: onNavigate,
        store: store,
        localStorage: window.localStorage
      });
    });
    describe("When I am on a Newbill Page and I choose an unsupported file", function () {
      test("It was Disabled", function () {
        var onNavigate = function onNavigate(pathname) {
          document.body.innerHTML = (0, _routes.ROUTES)({
            pathname: pathname
          });
        };

        var newBill = new _NewBill["default"]({
          document: document,
          onNavigate: onNavigate,
          store: null,
          localStorage: window.localStorage
        });
        var jsdomAlert = window.alert;

        window.alert = function () {};

        var file = _dom.screen.getByTestId('file');

        var handleChangeFile = jest.fn(newBill.handleChangeFile);
        file.addEventListener('change', handleChangeFile);

        _dom.fireEvent.change(file, {
          target: {
            files: [new File([''], 'readme.bmp', {
              type: 'image/bmp'
            })]
          }
        });

        var send = _dom.screen.getByTestId('btn-send-bill');

        expect(handleChangeFile).toHaveBeenCalled();
        expect(send).toBeDisabled();
        window.alert = jsdomAlert;
      });
    });
  }); // test post

  describe('Given I am a user connected as Employee and I am on NewBill page', function () {
    describe('When I submit the new bill', function () {
      test('create a new bill from mock API POST', function _callee() {
        var bill, callStore;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                bill = [{
                  "id": "47qAXb6fIm2zOKkLzMro",
                  "vat": "80",
                  "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                  "status": "pending",
                  "type": "Hôtel et logement",
                  "commentary": "séminaire billed",
                  "name": "encore",
                  "fileName": "preview-facture-free-201801-pdf-1.jpg",
                  "date": "2004-04-04",
                  "amount": 400,
                  "commentAdmin": "ok",
                  "email": "a@a",
                  "pct": 20
                }];
                callStore = jest.spyOn(_store["default"], 'bills');

                _store["default"].bills().create(bill);

                expect(callStore).toHaveBeenCalled();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        });
      });
      describe('When an error occurs on API', function () {
        /* Fonction appelée avant chaque test. */
        beforeEach(function () {
          jest.spyOn(_store["default"], 'bills');
          Object.defineProperty(window, 'localStorage', {
            value: _localStorage.localStorageMock
          });
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee',
            email: 'a@a'
          }));
          var root = document.createElement('div');
          root.setAttribute('id', 'root');
          document.body.appendChild(root);
          (0, _Router["default"])();
        });
        test('create new bill from an API and fails with 404 message error', function _callee2() {
          var message;
          return regeneratorRuntime.async(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _store["default"].bills.mockImplementationOnce(function () {
                    return {
                      create: function create() {
                        return Promise.reject(new Error('Erreur 404'));
                      }
                    };
                  });

                  window.onNavigate(_routes.ROUTES_PATH.NewBill);
                  _context2.next = 4;
                  return regeneratorRuntime.awrap(new Promise(process.nextTick));

                case 4:
                  _context2.next = 6;
                  return regeneratorRuntime.awrap(_dom.screen.getByText(/Erreur 404/));

                case 6:
                  message = _context2.sent;
                  expect(message).toBeTruthy();

                case 8:
                case "end":
                  return _context2.stop();
              }
            }
          });
        });
        test('create new bill from an API and fails with 500 message error', function _callee3() {
          var message;
          return regeneratorRuntime.async(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _store["default"].bills.mockImplementationOnce(function () {
                    return {
                      create: function create(bill) {
                        return Promise.reject(new Error("Erreur 500"));
                      }
                    };
                  });

                  window.onNavigate(_routes.ROUTES_PATH.NewBill);
                  _context3.next = 4;
                  return regeneratorRuntime.awrap(new Promise(process.nextTick));

                case 4:
                  _context3.next = 6;
                  return regeneratorRuntime.awrap(_dom.screen.getByAllText(/Erreur 500/));

                case 6:
                  message = _context3.sent;
                  expect(message).toBeTruthy();

                case 8:
                case "end":
                  return _context3.stop();
              }
            }
          });
        });
      });
    });
  });
});