import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../../services/api';

// Predefined list of standard courses
const STANDARD_COURSES = [
  "Computer Science Engineering (CSE)",
  "Mechanical Engineering (ME)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical Engineering (EE)",
  "Civil Engineering (CE)",
  "Artificial Intelligence and Machine Learning (AI & ML)",
  "Bachelor of Business Administration (BBA)",
  "Master of Business Administration (MBA)",
  "Bachelor of Computer Applications (BCA)",
  "Master of Computer Applications (MCA)",
];

const StudentForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male',
    dateOfBirth: '',
    course: '',
    address: '',
    status: 'Active',
  });

  // New States for the requested features
  const [countryCode, setCountryCode] = useState('+91');
  const [isOtherCourse, setIsOtherCourse] = useState(false);
  const [courseSelection, setCourseSelection] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const fetchStudent = async () => {
        try {
          const response = await API.get(`/students/${id}`);
          const student = response.data.data;
          
          // Handle Phone Number split if it was saved with a country code (e.g. "+91 9876543210")
          let extractedPhone = student.phoneNumber || '';
          let extractedCode = '+91';
          if (extractedPhone.includes(' ')) {
            const parts = extractedPhone.split(' ');
            extractedCode = parts[0];
            extractedPhone = parts[1];
          }

          // Handle Course logic
          let matchedCourseSelection = 'Other';
          let customCourseValue = student.course;
          
          if (STANDARD_COURSES.includes(student.course)) {
            matchedCourseSelection = student.course;
            customCourseValue = '';
          }
          
          setCourseSelection(matchedCourseSelection);
          setIsOtherCourse(matchedCourseSelection === 'Other');

          setCountryCode(extractedCode);
          setFormData({
            fullName: student.fullName,
            email: student.email,
            phoneNumber: extractedPhone,
            gender: student.gender,
            dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
            course: matchedCourseSelection === 'Other' ? customCourseValue : matchedCourseSelection,
            address: student.address,
            status: student.status,
          });
          
          if (student.profileImage?.url) {
            setPreviewUrl(student.profileImage.url);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch student details');
        } finally {
          setLoading(false);
        }
      };
      fetchStudent();
    }
  }, [id, isEditMode]);

  // Handle standard text inputs and Phone Number restriction
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNumber') {
      // Instantly wipe out any letters or symbols, keeping only 0-9
      const onlyNumbers = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: onlyNumbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Course Dropdown logic
  const handleCourseSelectionChange = (e) => {
    const value = e.target.value;
    setCourseSelection(value);
    
    if (value === 'Other') {
      setIsOtherCourse(true);
      setFormData({ ...formData, course: '' }); // Clear the value so they can type it
    } else {
      setIsOtherCourse(false);
      setFormData({ ...formData, course: value }); // Set to the predefined course
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const submitData = new FormData();
    
    // Combine Country Code and Phone Number before sending to the backend
    const fullPhoneNumber = `${countryCode} ${formData.phoneNumber}`;
    
    Object.keys(formData).forEach((key) => {
      if (key === 'phoneNumber') {
        submitData.append(key, fullPhoneNumber);
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (imageFile) {
      submitData.append('profileImage', imageFile);
    }

    try {
      if (isEditMode) {
        await API.put(`/students/${id}`, submitData);
      } else {
        await API.post('/students', submitData);
      }
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 text-center">Loading student data...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-xl shadow-sm border border-gray-100 mt-8">
      <div className="mb-6 border-b border-gray-100 pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Student Profile' : 'Register New Student'}
          </h2>
          <p className="text-gray-500 mt-1">Enter the student's academic and personal details.</p>
        </div>
        <Link to="/students" className="text-gray-500 hover:text-gray-800 font-medium transition-colors">
          Cancel
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="shrink-0">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-full border-2 border-white shadow-md" />
            ) : (
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 border-2 border-white shadow-md">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
            />
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <div className="flex gap-2">
              {/* Country Code Dropdown */}
              <select 
                value={countryCode} 
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-24 px-2 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="+91">IN (+91)</option>
                <option value="+1">US (+1)</option>
                <option value="+44">UK (+44)</option>
                <option value="+61">AU (+61)</option>
                <option value="+971">UAE (+971)</option>
              </select>
              
              {/* Restricted Number Input */}
              <input 
                type="tel" 
                name="phoneNumber" 
                maxLength="10" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                required 
                placeholder="10-digit number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Enrolled *</label>
            <div className="space-y-2">
              {/* Course Selection Dropdown */}
              <select 
                value={courseSelection} 
                onChange={handleCourseSelectionChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>Select a course...</option>
                {STANDARD_COURSES.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
                <option value="Other">Other (Please specify)</option>
              </select>

              {/* Conditionally rendered custom course input */}
              {isOtherCourse && (
                <input 
                  type="text" 
                  name="course" 
                  value={formData.course} 
                  onChange={handleChange} 
                  required={isOtherCourse}
                  placeholder="Enter custom course name..."
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50" 
                />
              )}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address *</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={saving} className={`px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {saving ? 'Saving...' : (isEditMode ? 'Update Student' : 'Save New Student')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;