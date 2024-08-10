import {
  addContact,
  getContactById,
  listContacts,
  modifyContact,
  removeContact
} from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res, next) => {
  let filters = null;

  const {favorite, limit, page} = req.query || {};

  if (favorite) {
    if (favorite === 'true') {
      filters = {
        favorite: true
      };
    } else if (favorite === 'false') {
      filters = {
        favorite: false
      };
    }
  }

  try {
    const contacts = await listContacts(filters, limit, page);
    return res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  let contact = null;

  try {
    contact = await getContactById(id);
  } catch (e) {
    return next(e);
  }

  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  let contact = null;

  try {
    contact = await removeContact(id);
  } catch (e) {
    return next(e);
  }

  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};

export const createContact = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(HttpError(500));
  }

  try {
    const contact = await addContact({ ...req.body, owner: user.id });

    return res.status(201).json(contact);
  } catch (e) {
    next(e);
  }
};

export const updateContact = async (req, res, next) => {
  const id = req.params.id;

  let contact = null;

  const { name, email, favorites } = req.body;

  try {
    contact = await modifyContact(id, { name, email, favorites });
  } catch (e) {
    return next(e);
  }

  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};

export const updateStatusContact = async (req, res, next) => {
  const id = req.params.id;

  let contact = null;

  const { favorite } = req.body;

  try {
    contact = await modifyContact(id, { favorite });
  } catch (e) {
    return next(e);
  }

  if (!contact) {
    return next(HttpError(404));
  }

  return res.status(200).json(contact);
};
