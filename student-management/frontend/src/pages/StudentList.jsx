import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const COURSE_MAPPING = {
  "CSE": "Computer Science Engineering (CSE)",
  "COMPUTER SCIENCE ENGINEERING": "Computer Science Engineering (CSE)",
  "CS": "Computer Science Engineering (CSE)",
  "IT": "Information Technology (IT)",
  "INFORMATION TECHNOLOGY": "Information Technology (IT)",
  "ECE": "Electronics and Communication Engineering (ECE)",
  "EC": "Electronics and Communication Engineering (ECE)",
  "EE": "Electrical Engineering (EE)",
  "ME": "Mechanical Engineering (ME)",
  "CE": "Civil Engineering (CE)",
  "AI/ML": "Artificial Intelligence and Machine Learning (AI & ML)",
  "AI & ML": "Artificial Intelligence and Machine Learning (AI & ML)",
  "BBA": "Bachelor of Business Administration (BBA)",
  "MBA": "Master of Business Administration (MBA)",
  "BCA": "Bachelor of Computer Applications (BCA)",
  "MCA": "Master of Computer Applications (MCA)",
};

const normalizeCourse = (course) => {
  if (!course) return '';
  const upperCaseCourse = course.trim().toUpperCase();
  return COURSE_MAPPING[upperCaseCourse] || course.trim();
};

const PREDEFINED_COURSES = [
  "Computer Science Engineering (CSE)",
  "Mechanical Engineering (ME)",
  "Electronics and Communication Engineering (ECE)",
  "Artificial Intelligence and Machine Learning (AI & ML)",
  "Information Technology (IT)",
  "Bachelor of Business Administration (BBA)",
  "Master of Business Administration (MBA)",
];

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // 1. Only send the text search to the backend
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await API.get(`/students?${params.toString()}`);
      
      // 2. Standardize ALL data the moment it arrives
      const standardizedStudents = response.data.data.map(student => ({
        ...student,
        course: normalizeCourse(student.course)
      }));
      
      // 3. Build the full unique course dropdown BEFORE applying dropdown filters
      const enrolledCourses = standardizedStudents.map(student => student.course);
      const uniqueCourses = [...new Set([...PREDEFINED_COURSES, ...enrolledCourses])];
      setAvailableCourses(uniqueCourses.filter(Boolean)); 

      // 4. APPLY COURSE AND STATUS FILTERS LOCALLY IN REACT
      // This bypasses any backend regex bugs or database mismatches entirely!
      let filteredData = standardizedStudents;

      if (courseFilter) {
        filteredData = filteredData.filter(student => student.course === courseFilter);
      }
      
      if (statusFilter) {
        filteredData = filteredData.filter(student => student.status === statusFilter);
      }

      setStudents(filteredData);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, courseFilter, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;

    setDeleting(true);
    try {
      await API.delete(`/students/${studentToDelete._id}`);
      setStudents(students.filter((student) => student._id !== studentToDelete._id));
      setStudentToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Directory</h1>
          <p className="text-gray-500 mt-1">Manage and view all enrolled students.</p>
        </div>
        <Link 
          to="/students/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          + Add New Student
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Start typing a name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            />
            {loading && searchTerm && (
               <div className="absolute right-3 top-2.5 text-blue-500">
                 <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               </div>
            )}
          </div>
          
          <div className="w-full md:w-48">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Courses</option>
              {availableCourses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </form>
      </div>

      {error && <div className="mb-4 text-red-500 bg-red-50 p-3 rounded">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Profile</th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium">Course</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading students...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No students match your criteria.</td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {student.profileImage?.url && student.profileImage.url !== "" ? (
                          <img 
                            src={student.profileImage.url} 
                            alt={student.fullName} 
                            className="w-12 h-12 rounded-full object-cover mr-4 border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mr-4 border border-blue-200 shadow-sm">
                            {student.fullName 
                              ? student.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
                              : 'S'}
                          </div>
                        )}
                        <span className="font-medium text-gray-800">{student.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-800">{student.email}</p>
                      <p className="text-xs text-gray-500 mt-1">{student.phoneNumber}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {student.course}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link 
                        to={`/students/edit/${student._id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => setStudentToDelete(student)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {studentToDelete && (
        <div className="delete-modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setStudentToDelete(null);
        }}>
          <section className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
            <div className="delete-modal-icon" aria-hidden="true">!</div>
            <p className="delete-modal-eyebrow">Delete student</p>
            <h2 id="delete-modal-title">Are you sure?</h2>
            <p>Delete <strong>{studentToDelete.fullName}</strong>? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button type="button" onClick={() => setStudentToDelete(null)} disabled={deleting} className="delete-modal-cancel">
                No, keep student
              </button>
              <button type="button" onClick={handleDelete} disabled={deleting} className="delete-modal-confirm">
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default StudentList;