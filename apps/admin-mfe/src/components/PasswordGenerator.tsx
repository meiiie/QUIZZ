import React, { useState } from 'react';
import { 
  generatePassword, 
  generateMultiplePasswords, 
  validatePasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
  PasswordOptions,
  defaultPasswordOptions 
} from '../utils/passwordGenerator';

interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void;
  onMultiplePasswordsGenerated: (passwords: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({
  onPasswordGenerated,
  onMultiplePasswordsGenerated,
  isOpen,
  onClose,
}) => {
  const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [passwordCount, setPasswordCount] = useState<number>(1);
  const [showMultiple, setShowMultiple] = useState<boolean>(false);

  const handleGeneratePassword = () => {
    const password = generatePassword(options);
    setGeneratedPassword(password);
    onPasswordGenerated(password);
  };

  const handleGenerateMultiple = () => {
    const passwords = generateMultiplePasswords(passwordCount, options);
    onMultiplePasswordsGenerated(passwords);
  };

  const handleOptionChange = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const passwordStrength = generatedPassword ? validatePasswordStrength(generatedPassword) : null;

  if (!isOpen) return null;

  return (
    <div className="password-generator-overlay">
      <div className="password-generator-modal">
        <div className="password-generator-header">
          <h3>Tạo mật khẩu tự động</h3>
          <button 
            className="password-generator-close"
            onClick={onClose}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <div className="password-generator-content">
          <div className="password-generator-options">
            <div className="password-option-group">
              <label className="password-option-label">
                Độ dài mật khẩu:
                <input
                  type="number"
                  min="4"
                  max="32"
                  value={options.length}
                  onChange={(e) => handleOptionChange('length', parseInt(e.target.value))}
                  className="password-option-input"
                />
              </label>
            </div>

            <div className="password-option-group">
              <label className="password-option-checkbox">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => handleOptionChange('includeUppercase', e.target.checked)}
                />
                Chữ hoa (A-Z)
              </label>
            </div>

            <div className="password-option-group">
              <label className="password-option-checkbox">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => handleOptionChange('includeLowercase', e.target.checked)}
                />
                Chữ thường (a-z)
              </label>
            </div>

            <div className="password-option-group">
              <label className="password-option-checkbox">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => handleOptionChange('includeNumbers', e.target.checked)}
                />
                Số (0-9)
              </label>
            </div>

            <div className="password-option-group">
              <label className="password-option-checkbox">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => handleOptionChange('includeSymbols', e.target.checked)}
                />
                Ký tự đặc biệt (!@#$%^&*)
              </label>
            </div>

            <div className="password-option-group">
              <label className="password-option-checkbox">
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={(e) => handleOptionChange('excludeSimilar', e.target.checked)}
                />
                Loại trừ ký tự dễ nhầm lẫn (0, O, l, 1, I)
              </label>
            </div>
          </div>

          <div className="password-generator-actions">
            <button
              onClick={handleGeneratePassword}
              className="password-generate-btn"
            >
              Tạo mật khẩu
            </button>

            <div className="password-multiple-section">
              <label className="password-option-checkbox">
                <input
                  type="checkbox"
                  checked={showMultiple}
                  onChange={(e) => setShowMultiple(e.target.checked)}
                />
                Tạo nhiều mật khẩu
              </label>

              {showMultiple && (
                <div className="password-multiple-controls">
                  <label className="password-option-label">
                    Số lượng:
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={passwordCount}
                      onChange={(e) => setPasswordCount(parseInt(e.target.value))}
                      className="password-option-input"
                    />
                  </label>
                  <button
                    onClick={handleGenerateMultiple}
                    className="password-generate-multiple-btn"
                  >
                    Tạo {passwordCount} mật khẩu
                  </button>
                </div>
              )}
            </div>
          </div>

          {generatedPassword && (
            <div className="password-result">
              <div className="password-display">
                <label>Mật khẩu đã tạo:</label>
                <div className="password-text">
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="password-input"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedPassword)}
                    className="password-copy-btn"
                    title="Sao chép"
                  >
                    📋
                  </button>
                </div>
              </div>

              {passwordStrength && (
                <div className="password-strength">
                  <div className="password-strength-label">
                    Độ mạnh: 
                    <span 
                      className="password-strength-text"
                      style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                    >
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="password-strength-feedback">
                      {passwordStrength.feedback.map((msg, index) => (
                        <div key={index} className="password-feedback-item">
                          • {msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
