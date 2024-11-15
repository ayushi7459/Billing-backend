export const isAdmin = (req, res, next) => {
    try {
        // Assuming user information (including role) is available in the decoded JWT payload
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();  // Proceed to the next middleware/route handler if the user is an admin
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
