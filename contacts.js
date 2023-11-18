const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname,  'db', 'contacts.json' );
const { nanoid } = require("nanoid");


async function listContacts() {
    const contacts = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  };


  async function getContactById(contactId) {
    const contacts = await listContacts();
    return contacts.find(({ id }) => id === contactId)|| null;
  }

  async function removeContact(contactId) {
    const contacts = await listContacts();
    const delContact = await getContactById(contactId);
   
    const newContactsList = contacts.filter(({ id }) => id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContactsList, null, 2));
    return delContact;

  }



  async function addContact(name, email, phone) {
    const contacts = await listContacts();
    if (
        contacts.some(
          ({ name: userName, email: userEmail, phone: userPhone }) =>
            userName === name || userPhone === phone || userEmail === email
        ) ||
        !name ||
        !email ||
        !phone
      ) {
        return null;
      }
    
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  }


  module.exports = { listContacts, getContactById, removeContact, addContact };