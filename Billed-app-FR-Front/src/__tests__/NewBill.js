/**
 * @jest-environment jsdom
 */


import { fireEvent, screen } from "@testing-library/dom"
import '@testing-library/jest-dom/extend-expect';
import NewBillUI from "../views/NewBillUI.js"

import NewBill from "../containers/NewBill.js"
import router from "../app/Router.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from '../__mocks__/store'
import { matchers } from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import store from "../__mocks__/store.js";
jest.mock("../__mocks__/store");


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
    test("A modal should open ", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)
  
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const store = null
  
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const newbill = new NewBill({
        document, onNavigate, store, localStorage: window.localStorage
      }) 
  })
  })
  
/* Test  si l'extension est correct ou pas si incorrect impossible d'envoyer */ 
  describe("When I am on a Newbill Page and I choose an unsupported file", () => {
    test("It was Disabled", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname
        });
      };

     const newBill = new NewBill({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      })
      const jsdomAlert = window.alert;
      window.alert = () => {};
      const file = screen.getByTestId('file')
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener('change', handleChangeFile)
      fireEvent.change(file, { 
        target: {
          files: [new File([''], 'readme.bmp', {
            type: 'image/bmp'
          })],
        }
      })
      const send = screen.getByTestId('btn-send-bill')
      expect(handleChangeFile).toHaveBeenCalled();
      expect(send).toBeDisabled();
      window.alert = jsdomAlert;
    }) 
})
     
    });


    describe('When an error occurs on API', () => {
        beforeEach(() => {
          
          jest.spyOn(mockStore, 'bills');
  
          Object.defineProperty(window, 'localStorage', { value: localStorageMock });
          window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: 'a@a',
          }));
  
          const root = document.createElement('div');
          root.setAttribute('id', 'root');
          document.body.appendChild(root);
          router();
        });
        
/* C'est un test qui vérifie si l'API renvoie une erreur 404. */
        test('create new bill from an API and fails with 404 message error', async () => {
          mockStore.bills.mockImplementationOnce(() => ({
            create: () => Promise.reject(new Error('Erreur 404')),
          }));
  
          window.onNavigate(ROUTES_PATH.NewBill);
  
          await new Promise(process.nextTick);
          
          const message = await screen.getByText(/Erreur 404/);
          expect(message).toBeTruthy();
        });
  
/* C'est un test qui vérifie si l'API renvoie une erreur 500. */
        test('create new bill from an API and fails with 500 message error', async () => {
          
          
          mockStore.bills.mockImplementationOnce(() => ({
            
            create: () =>  Promise.reject(new Error("Erreur 500"))
          }));
  
          window.onNavigate(ROUTES_PATH.NewBill);
          await new Promise(process.nextTick);
          const message = await screen.getByText(/Erreur 500/)
          expect(message).toBeTruthy();
        });
    });

/* Test du bouton d'envoi. */
    describe('Given I am on NewBill Page',()=>{
      describe("And I submit a valid bill form",()=>{
        test('Then a bill is created', async ()=>{
          document.body.innerHTML = NewBillUI()
          const newBill = new NewBill({
            document, onNavigate, store: null, localStorage:window.localStorage
          })
    
    const handleSubmit = jest.fn(newBill.handleSubmit)
    const newBillForm = screen.getByTestId('form-new-bill')
    newBillForm.addEventListener('submit', handleSubmit)
    fireEvent.submit(newBillForm)
    expect(handleSubmit).toHaveBeenCalled()
        })
      })
    })

  /* Test de l'extension de fichier. */
    describe('Given I am on NewBill Page',()=>{
      describe('When I upload an image file', ()=>{
        test('Then the file extension is correct',()=>{
          const newBill = new NewBill({
            document, onNavigate, store: null, localStorage: window.localStorage
          })
          const handleChangeFile = jest.fn(()=> newBill.handleChangeFile)
          const inputFile = screen.queryByTestId('file')
    
  
    inputFile.addEventListener('change', handleChangeFile)
    
    fireEvent.change(inputFile,{ 
      target: {
        files: [new File(['myTest.png'], 'myTest.png', {type: 'image/png'})]
      }
    
    })
    expect(handleChangeFile).toHaveBeenCalled()
    expect(inputFile.files[0].name).toBe('myTest.png')
        })
      })
    })

