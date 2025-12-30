import Link from "next/link";

export default function Sidebar() {
  const links = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Products", href: "/admin/products" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Add Product", href: "/admin/add-product" },
    { label: "Payments", href: "/admin/payments" },
  ];

  return (
    <div className="w-64 h-screen bg-[#ffffff] text-black flex flex-col">
      <h2 className="text-2xl font-bold p-4">StyleHub Admin</h2>
      <nav className="flex flex-col p-4 space-y-2 border-t">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:bg-gray-700 p-2 rounded"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
