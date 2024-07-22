import CreateInvoice from "@/components/CreateInvoice";
import ListInvoice from "@/components/ListInvoice";
import { getInvoices } from "@/lib/database/actions/invoice.actions";
import Image from "next/image";

export default async function Home({ params }: { params: { search: string, page: string}}) {
  const search = params.search || ""
  const page = params.page || ""

  const searchparams = {
    search,
    page,
    limit: 5
  }

  const res = await getInvoices({ searchparams })
  const invoices = JSON.parse(res) || []
  return (
    <div className="flex justify-center min-h-[82vh] mt-5">
      <section className="w-full px-2 max-w-[1000px]">
        <div className="header flex justify-between">
          <h3 className="text-2xl font-semibold">Invoice Manager</h3>
          <CreateInvoice />
        </div>
        <ListInvoice
          total={invoices.total}
          pageNumber={invoices.pageCount}
          invoices={invoices.data}
        />
      </section>
    </div>
  );
}
