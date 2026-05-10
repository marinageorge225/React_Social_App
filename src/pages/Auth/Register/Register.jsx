import React from "react";
import { Input } from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { Link } from "react-router";

function Register() {
  return (
    <>
      <form className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold my-2">
          Welcome to Our Social Media Platform
        </h2>
        <h2 className="text-2xl font-semibold my-2 text-blue-400">
          Registeration Form
        </h2>
        <p className="text-gray-400 text-lg my-2">
          Please Fill in This Form to Create An Account{" "}
        </p>
        <div className="form-body my-2">
          <Input label="Name" type="text" variant="bordered" className="pb-4" />
          <Input
            label="Email"
            type="email"
            variant="bordered"
            className="pb-4"
          />
          <Input
            label="Password"
            type="password"
            variant="bordered"
            className="pb-4"
          />
          <Input
            label="Re-Password"
            type="password"
            variant="bordered"
            className="pb-4"
          />
          <div className="flex gap-1 items-center justify-between">
            <DatePicker
              className="max-w-[284px]"
              label="Birth date"
              variant="bordered"
              className="pb-4"
            />
            <Select variant="bordered" className="pb-4" label="Gender">
              <SelectItem>Male</SelectItem>
              <SelectItem>Female</SelectItem>
            </Select>
          </div>
          <Button color="primary" className="w-full">
            Submit
          </Button>
        </div>
        <p className="text-center text-large">
          Already Have An Account ?
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </>
  );
}

export default Register;
