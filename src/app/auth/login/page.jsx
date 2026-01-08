"use client"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Login() {
    const router = useRouter()

    function handleSubmit(){
        router.push('/')
    }
    return (
        <div className="w-full flex justify-center items-center min-h-screen px-6">
            <div></div>
            <div className="max-w-md w-full px-2">
                <div className="mb-10 flex justify-center">
                    <p className="text-3xl font-bold">Login</p>
                </div>
                <FieldSet>
                    <FieldGroup>
                        <Field>
                            <FieldLabel>Role</FieldLabel>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="teacher">Teacher</SelectItem>
                                    <SelectItem value="student">Student</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription>
                                Select your role.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="userId">User ID</FieldLabel>
                            <Input id="userId" type="text" />
                            <FieldDescription>
                                Enter valid User ID.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password" />
                            <FieldDescription>
                                Enter your password.
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                    <Button asChild>
                        <Link href={'/'}>Login</Link></Button>
                </FieldSet>
            </div>
        </div>
    )
}
