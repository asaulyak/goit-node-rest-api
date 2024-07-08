import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { nanoid } from 'nanoid';

const contactsPath = resolve('db', 'contacts.json');

export async function listContacts() {
  try {
    const contacts = await readFile(contactsPath);

    return JSON.parse(contacts.toString());
  } catch (e) {
    console.error(`Could not list contacts from ${contactsPath}`, e);

    return [];
  }
}

export async function getContactById(contactId) {
  const contacts = await listContacts();

  return contacts.find(item => item.id === contactId) ?? null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();

  const contactToDelete = contacts.find(item => item.id === contactId);

  if (!contactToDelete) {
    return null;
  }

  const contactsAfterDelete = contacts.filter(contact => contact.id !== contactId);

  try {
    await storeContacts(contactsAfterDelete);
  } catch (e) {
    console.error(`Could not delete contact with id ${contactId}`, e);

    return null;
  }

  return contactToDelete;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(21),
    name,
    email,
    phone
  };

  try {
    await storeContacts([...contacts, newContact]);
  } catch (e) {
    console.error(`Could not add contact`, e);

    return null;
  }

  return newContact;
}

export async function modifyContact(id, data) {
  const contact = await getContactById(id);

  if (!contact) {
    return null;
  }

  const sanitizedData = Object.keys(data).reduce((acc, key) => {
    const value = data[key];

    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const updatedContact = { ...contact, ...sanitizedData };
  const contacts = (await listContacts()).map(item => (item.id === id ? updatedContact : item));

  try {
    await storeContacts(contacts);
  } catch (e) {
    console.error(`Could not update contact`, e);

    return null;
  }

  return updatedContact;
}

async function storeContacts(contacts) {
  try {
    await writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
  } catch (e) {
    console.error(`Could not store contacts`, e);
  }
}
