'use strict'

import { setCookie, getCookie, clearCookie } from './cookies.js';

const createTodoList = () => {
    window.addEventListener('load', () => {
        const inputBtn = document.getElementById('input_btn');
        const input = document.getElementById('input_field');
        const list = document.getElementById('list');

        getCookie();

        const loadFromCookie = () => {
            let arrayFromCookie = [];

            if (document.cookie === '') {
                arrayFromCookie = [];
            } else {
                const cookieValue = document.cookie;
                const valueStartIndex = (cookieValue.indexOf('=')) + 1;
                const arrayString = cookieValue.slice(valueStartIndex);
                arrayFromCookie = JSON.parse(arrayString);
            };

            return arrayFromCookie;
        };

      const arrayOfCookies = loadFromCookie();
      const arrayOfUnsavedItems = [];
      const arrayOfSavedItems = [];
      let arrayOfCookiesAndUnsavedItems = [];
      let arrayOfCookiesAndSavedItems = [];

      const renderListItem = (obj) => {
          const listItemTemplate = `
              <li id=${obj.id} data-action="choose">
                <p>${obj.title}</p>
                <button type="button" name="save_item" class="unsaved" data-action="save_to_cookie"><i class="fa-regular fa-square-check"></i>Save</button>
                <button type="button" name="delete_item" class="delete_item_btn" data-action="delete"><i class="fa-solid fa-circle-xmark"></i>Delete</button>
              </li>
              `;

          return listItemTemplate;
      };

      inputBtn.addEventListener('click', (event) => {
          const action = event.target.dataset.action;

          if (action === 'save' && input.value !== '') {
              const listItem = {
                title: input.value,
                id: `${new Date().getMilliseconds().toString()}`,
              };
              list.insertAdjacentHTML('afterbegin', renderListItem(listItem));
              arrayOfUnsavedItems.push(listItem);
              arrayOfCookiesAndUnsavedItems = arrayOfCookies.concat(arrayOfUnsavedItems);
              input.value = '';
          };

          if (action === 'edit' && input.value !=='') {
              const editItemBtnId = event.target.getAttribute('data-edit-item-id')
              let itemToEdit;
              let indexOfItemToEdit;

              if (itemToEdit = arrayOfCookiesAndSavedItems.find(item => item.id === editItemBtnId)) {
                  indexOfItemToEdit = arrayOfCookiesAndSavedItems.findIndex(item => item.id === editItemBtnId);
                  itemToEdit.title = input.value;
                  arrayOfCookiesAndSavedItems.splice(indexOfItemToEdit, 1, itemToEdit);

                  setCookie(arrayOfCookiesAndSavedItems);
              };

              if (itemToEdit = arrayOfCookiesAndUnsavedItems.find(item => item.id === editItemBtnId)) {
                  indexOfItemToEdit = arrayOfCookiesAndUnsavedItems.findIndex(item => item.id === editItemBtnId);
                  itemToEdit.title = input.value;
                  arrayOfCookiesAndUnsavedItems.splice(indexOfItemToEdit, 1, itemToEdit);

                  setCookie(arrayOfCookiesAndSavedItems);
              };

              if (itemToEdit = arrayOfCookies.find(item => item.id === editItemBtnId)) {
                  indexOfItemToEdit = arrayOfCookies.findIndex(item => item.id === editItemBtnId);
                  itemToEdit.title = input.value;
                  arrayOfCookies.splice(indexOfItemToEdit, 1, itemToEdit);

                  setCookie(arrayOfCookies);
              };

              document.getElementById(editItemBtnId).childNodes[1].innerText = input.value;
              event.target.removeAttribute('data-edit-item-id');
              event.target.setAttribute('data-action', 'save');
              inputBtn.innerText = inputBtn.getAttribute('data-action');
              input.value = '';
          };

          if (action === 'edit' && input.value === '') {
              inputBtn.removeAttribute('data-edit-item-id');
              inputBtn.setAttribute('data-action', 'save');
              inputBtn.innerText = inputBtn.getAttribute('data-action');
              input.value = '';
          }
      });

      list.addEventListener('click', (event) => {
          const action = event.target.dataset.action;

          if (action === 'save_to_cookie') {
              const saveCookieBtnId = event.target.parentElement.getAttribute('id');

              if (arrayOfCookiesAndSavedItems.find(item => item.id === saveCookieBtnId)) {
                  return;
              };

              const itemToSave = arrayOfCookiesAndUnsavedItems.find(item => item.id === saveCookieBtnId);
              const indexOfItemToSave = arrayOfCookiesAndUnsavedItems.findIndex(item => item.id === saveCookieBtnId);
              itemToSave.index = indexOfItemToSave;
              arrayOfSavedItems.push(itemToSave);
              arrayOfSavedItems.sort((a, b) => a.index - b.index);
              arrayOfCookiesAndSavedItems = arrayOfCookies.concat(arrayOfSavedItems);

              setCookie(arrayOfCookiesAndSavedItems);

              if (arrayOfCookiesAndSavedItems.includes(itemToSave)) {
                  event.target.classList.remove('unsaved');
              };

              input.value = '';
          };

          if (action === 'delete') {
              const deleteItemBtnId = event.target.parentElement.getAttribute('id');
              let itemToDelete;
              let indexOfItemToDelete;

              if (itemToDelete = arrayOfCookiesAndSavedItems.find(item => item.id === deleteItemBtnId)) {
                  indexOfItemToDelete = arrayOfCookiesAndSavedItems.findIndex(item => item.id === deleteItemBtnId);
                  arrayOfCookiesAndSavedItems.splice(indexOfItemToDelete, 1);

                  setCookie(arrayOfCookiesAndSavedItems);
              };

              if (itemToDelete = arrayOfCookiesAndUnsavedItems.find(item => item.id === deleteItemBtnId)) {
                  indexOfItemToDelete = arrayOfCookiesAndUnsavedItems.findIndex(item => item.id === deleteItemBtnId);
                  arrayOfCookiesAndUnsavedItems.splice(indexOfItemToDelete, 1);

                  setCookie(arrayOfCookiesAndSavedItems);
              };

              if (itemToDelete = arrayOfCookies.find(item => item.id === deleteItemBtnId)) {
                  indexOfItemToDelete = arrayOfCookies.findIndex(item => item.id === deleteItemBtnId);
                  arrayOfCookies.splice(indexOfItemToDelete, 1);

                  setCookie(arrayOfCookies);
              };
              event.target.parentElement.remove();
              inputBtn.setAttribute('data-action', 'save');
              inputBtn.innerText = inputBtn.getAttribute('data-action');
              input.value = '';
          };

          if (action === 'choose') {
              inputBtn.setAttribute('data-action', 'edit');
              inputBtn.innerText = inputBtn.getAttribute('data-action');
              input.focus();
              const itemId = event.target.id;
              let itemToChoose = arrayOfCookiesAndSavedItems.find(item => item.id === itemId);

              if (!arrayOfCookiesAndSavedItems.includes(itemToChoose)) {
                  itemToChoose = arrayOfCookiesAndUnsavedItems.find(item => item.id === itemId);
              };

              if (!arrayOfCookiesAndUnsavedItems.includes(itemToChoose)) {
                  itemToChoose = arrayOfCookies.find(item => item.id === itemId);
              };

              input.value = itemToChoose.title;
              inputBtn.setAttribute('data-edit-item-id', `${itemId}`)
          };
      });

      document.getElementById('delete_all').addEventListener('click', () => {
          clearCookie();
          arrayOfCookies.length = 0;
          arrayOfUnsavedItems.length = 0;
          arrayOfSavedItems.length = 0;
          list.innerHTML = '';
          input.value = '';
      });

      document.querySelector('.wrapper').addEventListener('click', (event) => {
          if (event.target === event.currentTarget && input.value === '') {
              inputBtn.removeAttribute('data-edit-item-id');
              inputBtn.setAttribute('data-action', 'save');
              inputBtn.innerText = inputBtn.getAttribute('data-action');
              input.value = '';
          } else {
              return;
          };
      });
  });
};

document.addEventListener('DOMContentLoaded', createTodoList);
