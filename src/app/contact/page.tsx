export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="text"
          placeholder="Name"
        />
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Your message"
        ></textarea>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </main>
  );
}
