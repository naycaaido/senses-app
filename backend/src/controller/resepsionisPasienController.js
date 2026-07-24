import BadRequestError from "../exceptions/BadRequestError.js";
import pasienService from "../services/pasienService.js";

const parsePositiveInteger = (value, field, defaultValue, max) => {
  if (value === undefined) {
    return defaultValue;
  }

  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max) {
    throw new BadRequestError(`${field} must be an integer between 1 and ${max}`);
  }

  return parsed;
};

const listPasien = async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, "page", 1, 1000000);
    const limit = parsePositiveInteger(req.query.limit, "limit", 20, 100);
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim() || undefined
        : undefined;

    const result = await pasienService.listPasienByResepsionis({
      page,
      limit,
      search,
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const createPasien = async (req, res, next) => {
  try {
    const patient = await pasienService.createPasienByResepsionis(req.body);
    return res.status(201).json({
      message: "Patient created successfully",
      patient,
    });
  } catch (error) {
    return next(error);
  }
};

const updatePasien = async (req, res, next) => {
  try {
    const patient = await pasienService.updatePasienByResepsionis(
      req.params.email,
      req.body,
    );
    return res.status(200).json({
      message: "Patient updated successfully",
      patient,
    });
  } catch (error) {
    return next(error);
  }
};

export default { listPasien, createPasien, updatePasien };
