import { Contact } from './schemas/contact.js';

export function listContacts() {
  return Contact.find();
}

export function getContactById(id) {
  return Contact.findOne({ _id: id });
}

export function removeContact(id) {
  return Contact.findByIdAndDelete(id);
}

export function addContact(data) {
  return Contact.create(data);
}

export function modifyContact(id, data) {
  return Contact.findByIdAndUpdate({ _id: id }, data, { new: true });
}
