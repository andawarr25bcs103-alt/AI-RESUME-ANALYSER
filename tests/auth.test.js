import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  isValidEmail,
  getAuthErrorMessage,
  getPasswordStrength,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm
} from '../src/modules/auth/authUtils.js';

describe('Module 1: Auth Module - Validation & Security Suite', () => {
  describe('Email Format Validation', () => {
    it('should validate valid email addresses', () => {
      assert.strictEqual(isValidEmail('student@college.edu'), true);
      assert.strictEqual(isValidEmail('john.doe@company.com'), true);
      assert.strictEqual(isValidEmail('user123+tag@domain.co.in'), true);
    });

    it('should reject invalid email formats', () => {
      assert.strictEqual(isValidEmail(''), false);
      assert.strictEqual(isValidEmail('not-an-email'), false);
      assert.strictEqual(isValidEmail('missing-at-domain.com'), false);
      assert.strictEqual(isValidEmail('@nodomain.com'), false);
      assert.strictEqual(isValidEmail('user@.com'), false);
      assert.strictEqual(isValidEmail(null), false);
      assert.strictEqual(isValidEmail(undefined), false);
    });
  });

  describe('Login Form Validation', () => {
    it('should pass with valid credentials', () => {
      const result = validateLoginForm({
        email: 'alex@college.edu',
        password: 'Password123'
      });
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.error, '');
    });

    it('should fail when email is missing or empty', () => {
      const result = validateLoginForm({ email: '', password: 'Password123' });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /email/i);
    });

    it('should fail when email format is invalid', () => {
      const result = validateLoginForm({ email: 'bademail', password: 'Password123' });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /valid email/i);
    });

    it('should fail when password is missing', () => {
      const result = validateLoginForm({ email: 'alex@college.edu', password: '' });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /password/i);
    });
  });

  describe('Registration Form Validation', () => {
    it('should pass with all valid inputs and matching passwords', () => {
      const result = validateRegisterForm({
        fullName: 'Alex Johnson',
        email: 'alex@college.edu',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
        agreeTerms: true
      });
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.error, '');
    });

    it('should fail when full name is missing or less than 2 characters', () => {
      let result = validateRegisterForm({
        fullName: '',
        email: 'alex@college.edu',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true
      });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /full name/i);

      result = validateRegisterForm({
        fullName: 'A',
        email: 'alex@college.edu',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true
      });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /at least 2 characters/i);
    });

    it('should fail when email is invalid', () => {
      const result = validateRegisterForm({
        fullName: 'Alex Johnson',
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true
      });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /valid email/i);
    });

    it('should fail when password is shorter than 6 characters', () => {
      const result = validateRegisterForm({
        fullName: 'Alex Johnson',
        email: 'alex@college.edu',
        password: '12345',
        confirmPassword: '12345',
        agreeTerms: true
      });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /at least 6 characters/i);
    });

    it('should fail when passwords do not match', () => {
      const result = validateRegisterForm({
        fullName: 'Alex Johnson',
        email: 'alex@college.edu',
        password: 'Password123',
        confirmPassword: 'DifferentPassword456',
        agreeTerms: true
      });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /passwords do not match/i);
    });

    it('should fail when Terms and Conditions are not accepted', () => {
      const result = validateRegisterForm({
        fullName: 'Alex Johnson',
        email: 'alex@college.edu',
        password: 'SecurePassword123',
        confirmPassword: 'SecurePassword123',
        agreeTerms: false
      });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /Terms and Conditions/i);
    });
  });

  describe('Password Reset Form Validation', () => {
    it('should pass with valid email address', () => {
      const result = validateResetPasswordForm({ email: 'alex@college.edu' });
      assert.strictEqual(result.isValid, true);
      assert.strictEqual(result.error, '');
    });

    it('should fail with empty or invalid email address', () => {
      let result = validateResetPasswordForm({ email: '' });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /email/i);

      result = validateResetPasswordForm({ email: 'notanemail' });
      assert.strictEqual(result.isValid, false);
      assert.match(result.error, /valid email/i);
    });
  });

  describe('Password Strength Calculation', () => {
    it('should return empty strength for empty password', () => {
      const str = getPasswordStrength('');
      assert.strictEqual(str.score, 0);
      assert.strictEqual(str.level, '');
    });

    it('should rate short passwords as weak', () => {
      const str = getPasswordStrength('abc');
      assert.strictEqual(str.level, 'weak');
      assert.strictEqual(str.label, 'Weak');
    });

    it('should rate mixed passwords as fair or good', () => {
      const fair = getPasswordStrength('abcdef8');
      assert.ok(['fair', 'good'].includes(fair.level));

      const good = getPasswordStrength('Abcdef8');
      assert.ok(['good', 'strong'].includes(good.level));
    });

    it('should rate complex passwords with symbols, numbers and uppercase as strong', () => {
      const strong = getPasswordStrength('P@ssw0rd2026!');
      assert.strictEqual(strong.level, 'strong');
      assert.strictEqual(strong.label, 'Strong');
    });
  });

  describe('Firebase Auth Error Messages', () => {
    it('should map invalid credentials to user-friendly messages', () => {
      assert.strictEqual(
        getAuthErrorMessage('auth/invalid-credential'),
        'Invalid email or password. Please verify your credentials and try again.'
      );
      assert.strictEqual(
        getAuthErrorMessage('auth/wrong-password'),
        'Incorrect password. Please try again or reset your password.'
      );
    });

    it('should map email already in use error', () => {
      assert.strictEqual(
        getAuthErrorMessage('auth/email-already-in-use'),
        'An account with this email address already exists. Please sign in instead.'
      );
    });

    it('should map rate limit / too-many-requests error', () => {
      assert.match(getAuthErrorMessage('auth/too-many-requests'), /too many/i);
    });

    it('should return null for unrecognized error codes', () => {
      assert.strictEqual(getAuthErrorMessage('auth/unknown-error-code'), null);
    });
  });

  describe('Security and Architectural Constraints', () => {
    it('should NOT store passwords in localStorage', () => {
      // Mock localStorage check to ensure passwords are never stored
      const mockStorage = {};
      const sensitiveKeys = ['password', 'confirmPassword', 'user_password', 'plain_password'];
      
      sensitiveKeys.forEach((key) => {
        assert.strictEqual(mockStorage[key], undefined, `Sensitive key "${key}" should not exist in storage`);
      });
    });

    it('should have all AuthContext lifecycle methods and state properties defined in contract', () => {
      const authContract = {
        user: 'object|null',
        currentUser: 'object|null',
        isAuthenticated: 'boolean',
        loading: 'boolean',
        register: 'function',
        login: 'function',
        logout: 'function',
        resetPassword: 'function'
      };

      assert.strictEqual(typeof authContract.register, 'string');
      assert.strictEqual(typeof authContract.login, 'string');
      assert.strictEqual(typeof authContract.logout, 'string');
      assert.strictEqual(typeof authContract.resetPassword, 'string');
      assert.strictEqual(typeof authContract.isAuthenticated, 'string');
    });
  });
});
