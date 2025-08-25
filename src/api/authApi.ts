// Fake backend API for authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user'
  }
];

// Mock passwords (in real app, these would be hashed)
const mockPasswords: { [email: string]: string } = {
  'admin@example.com': 'admin123',
  'user@example.com': 'user123'
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock JWT token
const generateToken = (user: User): string => {
  return btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 3600000 }));
};

// Validate token
export const validateToken = (token: string): User | null => {
  try {
    const decoded = JSON.parse(atob(token));
    if (decoded.exp < Date.now()) {
      return null; // Token expired
    }
    return mockUsers.find(user => user.id === decoded.userId) || null;
  } catch {
    return null;
  }
};

// Login API
export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  await delay(1000); // Simulate network delay

  const { email, password } = credentials;

  // Find user
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }

  // Check password
  if (mockPasswords[email] !== password) {
    return {
      success: false,
      message: 'Invalid password'
    };
  }

  // Generate token
  const token = generateToken(user);

  return {
    success: true,
    user,
    token,
    message: 'Login successful'
  };
};

// Register API
export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  await delay(1000); // Simulate network delay

  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  
  if (existingUser) {
    return {
      success: false,
      message: 'User already exists with this email'
    };
  }

  // Validate input
  if (!name || !email || !password) {
    return {
      success: false,
      message: 'All fields are required'
    };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: 'Password must be at least 6 characters long'
    };
  }

  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email,
    name,
    role: 'user'
  };

  // Add to mock database
  mockUsers.push(newUser);
  mockPasswords[email] = password;

  // Generate token
  const token = generateToken(newUser);

  return {
    success: true,
    user: newUser,
    token,
    message: 'Registration successful'
  };
};

// Logout API
export const logoutUser = async (): Promise<{ success: boolean }> => {
  await delay(500);
  return { success: true };
};
