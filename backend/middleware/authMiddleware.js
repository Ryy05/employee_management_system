import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
        schoolId: decoded.schoolId || null,
        zoneId: decoded.zoneId || null,
        districtId: decoded.districtId || null,
        employeeId: decoded.employeeId || null,
      };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};



export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
  };
};


export const isCEO = (req, res, next) => {
  if (req.user && req.user.role === "CEO") {
    next();
  } else {
    return res.status(403).json({ message: "Requires CEO role" });
  }
};


export const isZEO = (req, res, next) => {
  if (req.user && req.user.role === "ZEO") {
    next();
  } else {
    return res.status(403).json({ message: "Requires ZEO role" });
  }
};


export const isSchoolAdmin = (req, res, next) => {
  if (req.user && req.user.role === "schoolAdmin") {
    next();
  } else {
    return res.status(403).json({ message: "Requires schoolAdmin role" });
  }
};


export const isStaff = (req, res, next) => {
  if (req.user && req.user.role === "staff") {
    next();
  } else {
    return res.status(403).json({ message: "Requires staff role" });
  }
};
