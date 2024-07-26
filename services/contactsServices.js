import { Contact } from './models/contact.model.js';

export function listContacts() {
  return Contact.findAll();
}

export function getContactById(id) {
  return Contact.findOne({
    where: {
      id
    }
  });
}

export function removeContact(id) {
  return Contact.destroy(id);
}

export function addContact(data) {
  return Contact.create(data);
}

export async function modifyContact(id, data) {
  const [_, contact] = await Contact.update(data, {
    where: {
      id
    },
    returning: true,
    plain: true
  });

  return contact;
}
