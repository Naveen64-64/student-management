import apiClient from './axiosConfig';

/**
 * Service for communicating with Spring Boot Student Management backend
 */
export const studentService = {
  /**
   * Fetch all students
   * GET /api/students
   * @returns {Promise<Array>} List of students
   */
  async getAllStudents() {
    const response = await apiClient.get('');
    return response.data;
  },

  /**
   * Fetch a single student by ID
   * GET /api/students/{id}
   * @param {number|string} id - Student ID
   * @returns {Promise<Object>} Student details
   */
  async getStudentById(id) {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  /**
   * Create a new student
   * POST /api/students
   * @param {Object} studentData - { name, email, age, course, phone }
   * @returns {Promise<Object>} Created student
   */
  async createStudent(studentData) {
    const response = await apiClient.post('', {
      name: studentData.name?.trim(),
      email: studentData.email?.trim(),
      age: Number(studentData.age),
      course: studentData.course?.trim(),
      phone: studentData.phone?.trim(),
    });
    return response.data;
  },

  /**
   * Update an existing student
   * PUT /api/students/{id}
   * @param {number|string} id - Student ID
   * @param {Object} studentData - { name, email, age, course, phone }
   * @returns {Promise<Object>} Updated student
   */
  async updateStudent(id, studentData) {
    const response = await apiClient.put(`/${id}`, {
      name: studentData.name?.trim(),
      email: studentData.email?.trim(),
      age: Number(studentData.age),
      course: studentData.course?.trim(),
      phone: studentData.phone?.trim(),
    });
    return response.data;
  },

  /**
   * Delete a student by ID
   * DELETE /api/students/{id}
   * @param {number|string} id - Student ID
   * @returns {Promise<void>}
   */
  async deleteStudent(id) {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  },
};

export default studentService;
