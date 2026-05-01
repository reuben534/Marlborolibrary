import Member from '../models/Member.js';

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin/Librarian)
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({});
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single member
// @route   GET /api/members/:id
// @access  Private (Admin/Librarian)
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      res.json(member);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a member
// @route   POST /api/members
// @access  Private (Admin/Librarian)
export const createMember = async (req, res) => {
  const { name, phone, email, status } = req.body;

  try {
    const memberExists = await Member.findOne({ email });

    if (memberExists) {
      return res.status(400).json({ message: 'Member already exists with this email' });
    }

    const member = await Member.create({
      name,
      phone,
      email,
      status: status || 'active',
    });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a member
// @route   PUT /api/members/:id
// @access  Private (Admin/Librarian)
export const updateMember = async (req, res) => {
  const { name, phone, email, status } = req.body;

  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      member.name = name || member.name;
      member.phone = phone || member.phone;
      member.email = email || member.email;
      member.status = status || member.status;

      const updatedMember = await member.save();
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a member
// @route   DELETE /api/members/:id
// @access  Private (Admin/Librarian)
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      await member.deleteOne();
      res.json({ message: 'Member removed' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
