const mockCourses = [
  { title: "React for Beginners", slug: "react-for-beginners" },
  { title: "Mastering Node.js", slug: "mastering-nodejs" },
];

export default function CoursesPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Our Courses</h1>
      <ul className="space-y-4">
        {mockCourses.map((course) => (
          <li key={course.slug}>
            <a
              href={`/courses/${course.slug}`}
              className="text-xl text-blue-600 hover:underline"
            >
              {course.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
