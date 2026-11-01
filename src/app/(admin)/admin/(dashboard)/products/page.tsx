import Link from "next/link";
import { adminListProducts, notConfigured } from "@/lib/admin/data";
import {
  quickProductUpdate,
  duplicateProduct,
  deleteProduct,
} from "@/lib/admin/actions";
import { PageTitle, Banner } from "@/components/admin/ui";

export default async function ProductsPage() {
  const products = await adminListProducts();

  return (
    <div>
      <PageTitle
        title="Products"
        action={
          <Link
            href="/admin/products/new"
            className="bg-ivory px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink"
          >
            New product
          </Link>
        }
      >
        {products.length} total
      </PageTitle>

      {notConfigured() && (
        <Banner kind="info">
          Read-only preview of seed data. Configure Supabase to create and edit
          products.
        </Banner>
      )}

      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-ink-800 text-left text-xs uppercase tracking-[0.1em] text-ivory/45">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Order</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id} className="align-middle hover:bg-ivory/5">
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-accent-soft">
                    {p.name_en}
                  </Link>
                  <span className="block text-xs text-ivory/35">/{p.slug}</span>
                </td>
                <td className="p-3 text-ivory/60">{p.category?.name_en ?? "—"}</td>
                <td className="p-3">
                  <form action={quickProductUpdate}>
                    <input type="hidden" name="id" value={p.id} />
                    <select
                      name="status"
                      defaultValue={p.status}
                      className="border border-line bg-transparent px-2 py-1 text-xs"
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                      <option value="hidden">hidden</option>
                    </select>
                    <button className="ms-2 text-xs text-ivory/45 hover:text-ivory">
                      set
                    </button>
                  </form>
                </td>
                <td className="p-3">
                  <form action={quickProductUpdate}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="featured" value={p.featured ? "false" : "true"} />
                    <button className="text-xs text-ivory/60 hover:text-ivory">
                      {p.featured ? "★ featured" : "☆ no"}
                    </button>
                  </form>
                </td>
                <td className="p-3">
                  <form action={quickProductUpdate} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      name="sort_order"
                      type="number"
                      defaultValue={p.sort_order}
                      className="w-16 border border-line bg-transparent px-2 py-1 text-xs"
                    />
                    <button className="text-xs text-ivory/45 hover:text-ivory">set</button>
                  </form>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <form action={duplicateProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-xs text-ivory/45 hover:text-ivory">duplicate</button>
                    </form>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="text-xs text-[#d98b7a] hover:underline">delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
