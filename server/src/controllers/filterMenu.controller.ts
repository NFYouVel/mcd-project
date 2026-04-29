import { FilterMenu } from "../models/FilterMenu.js";
import { MenuSection } from "../models/MenuSection.js";
import { Menu } from "../models/Menu.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIdParam } from "../utils/validateId.js";
import { Request, Response } from "express";

export const getAllFilters = asyncHandler(async (req, res) => {
  const sectionMenuId = req.query.sectionMenuId;
  const where: any = {};
  if (sectionMenuId && typeof sectionMenuId === "string") {
    where.sectionMenuId = sectionMenuId;
  }

  const filters = await FilterMenu.findAll({
    where,
    include: [MenuSection, Menu],
  });
  res.json({ success: true, data: filters });
});

export const getFilterById = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  const filter = await FilterMenu.findByPk(id, {
    include: [MenuSection, Menu],
  });
  if (!filter) return res.status(404).json({ success: false, message: "Not found" });
  res.json({ success: true, data: filter });
});

export const createFilter = asyncHandler(async (req, res) => {
  const { name, description, sectionMenuId } = req.body;
  if (!name || !sectionMenuId) {
    return res.status(400).json({ success: false, message: "name & sectionMenuId required" });
  }
  const filter = await FilterMenu.create({ name, description, sectionMenuId });
  res.status(201).json({ success: true, data: filter });
});

export const updateFilter = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  const filter = await FilterMenu.findByPk(id);
  if (!filter) return res.status(404).json({ success: false, message: "Not found" });
  await filter.update(req.body);
  res.json({ success: true, data: filter });
});

export const deleteFilter = asyncHandler(async (req, res) => {
  const id = getIdParam(req);
  const filter = await FilterMenu.findByPk(id);
  if (!filter) return res.status(404).json({ success: false, message: "Not found" });
  await filter.destroy();
  res.json({ success: true, message: "Filter deleted" });
});