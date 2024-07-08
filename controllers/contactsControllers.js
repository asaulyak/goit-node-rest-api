import {
  addContact,
  getContactById,
  listContacts,
  modifyContact,
  removeContact
} from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (_, res) => {
  const contacts = await listContacts();

  return res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  const contact = await getContactById(id);

  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  const contact = await removeContact(id);

  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};

export const createContact = async (req, res) => {
  const contact = await addContact(req.body);

  return res.status(201).json(contact);
};

export const updateContact = async (req, res, next) => {
  const id = req.params.id;

  const contact = await modifyContact(id, req.body);
  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};
