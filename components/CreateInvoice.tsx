"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { createInvoice } from "@/lib/database/actions/invoice.actions";
import toast from "react-hot-toast";

const FormSchema = z.object({
  name: z.string().min(2, "Name must be more than 2 character"),
  status: z.enum(["paid", "unpaid"], {
    required_error: "You need to select a notification type.",
  }),
  amount: z.coerce.number({ required_error: "amount is required" }),
});

const customers = [
  {
    id: 1,
    name: "Chukwu ajah",
    email: "casmannydev@gmail.com",
  },
  {
    id: 2,
    name: "kingsley Eze",
    email: "chukwuajahsabastinechukwu@gmail.com",
  },
  {
    id: 3,
    name: "Okoye Vivian",
    email: "090casman@gmail.com",
  },
  {
    id: 4,
    name: "Nwadu Chioma",
    email: "chukwuajahsabastinedev@gmail.com",
  },
  {
    id: 5,
    name: "Odinaka chukwu",
    email: "chukwusabastine2018@gmail.com",
  },
];

const CreateInvoice = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      amount: 0,
      status: "unpaid",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const { amount, name, status } = values;
    const customer = customers.find(
      (customer) => customer.name === name
    );
    const formdata = {
      amount,
      status,
      customer,
        name,
      id: id ? id : ""
    };
      try {
          const res = await createInvoice({formdata})
          toast.success(res?.message!)
          form.reset()
          
      } catch (error) {
        toast.error("something went wrong")
      }
  
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center bg-black  text-white p-3 rounded-md">
        Create Invoice <Plus />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Invoice</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((customer, index) => (
                        <SelectItem value={customer.name}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>status</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="unpaid" />
                        </FormControl>
                        <FormLabel className="font-normal">unpaid</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="paid" />
                        </FormControl>
                        <FormLabel className="font-normal">paid</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="$4.55"
                      step={"0.01"}
                      type={"number"}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Submit</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateInvoice;
