import Member from '../models/Member.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin/Librarian)
export const getMembers = asyncHandler(async (req, res) => {
  const members = await Member.find({});
  res.json(members);
});

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private (Admin/Librarian)
export const getMemberById = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (member) {
    res.json(member);
  } else {
    res.status(404);
    throw new Error('Member not found');
  }
});

// @desc    Create a member
// @route   POST /api/members
// @access  Private (Admin/Librarian)
export const createMember = asyncHandler(async (req, res) => {
  const { name, phone, email, status } = req.body;

  if (!name || !phone || !email) {
    res.status(400);
    throw new Error('Please provide name, phone, and email');
  }

  // Basic email validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }

  const memberExists = await Member.findOne({ email });

  if (memberExists) {
    res.status(400);
    throw new Error('Member already exists with this email');
  }

  const member = await Member.create({
    name,
    phone,
    email,
    status: status || 'active',
  });

  res.status(201).json(member);
});

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private (Admin/Librarian)
export const updateMember = asyncHandler(async (req, res) => {
  const { name, phone, email, status } = req.body;

  const member = await Member.findById(req.params.id);

  if (member) {
    if (email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address');
      }

      // Check if email is taken by another member
      const emailExists = await Member.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already in use by another member');
      }
    }

    member.name = name || member.name;
    member.phone = phone || member.phone;
    member.email = email || member.email;
    member.status = status || member.status;

    const updatedMember = await member.save();
    res.json(updatedMember);
  } else {
    res.status(404);
    throw new Error('Member not found');
  }
});

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private (Admin/Librarian)
export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);

  if (member) {
    await member.deleteOne();
    res.json({ message: 'Member removed' });
  } else {
    res.status(404);
    throw new Error('Member not found');
  }
});
