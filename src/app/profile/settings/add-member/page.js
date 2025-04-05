export default function MembersList() {
  const members = [
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Jane Smith", role: "Moderator" },
    { id: 3, name: "Alice Johnson", role: "Member" },
    { id: 4, name: "Bob Brown", role: "Member" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Members List</h2>
      <ul className="space-y-3">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <span className="font-medium">{member.name}</span>
            <span className="text-gray-500 text-sm">{member.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
