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

export default function AdminRegister() {
    return (
        <div className="w-full flex justify-center items-center min-h-screen px-6">
            <div></div>
            <div className="max-w-md w-full px-2">
                <div className="mb-10 flex justify-center">
                    <p className="text-3xl font-bold">Admin Register</p>
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
                                Choose a unique userId for your account.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="text" />
                            <FieldDescription>
                                Must be a valid email id.
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password" />
                            <FieldDescription>
                                Must be at least 8 characters long.
                            </FieldDescription>
                        </Field>
                        <Button>Register</Button>
                    </FieldGroup>
                </FieldSet>
            </div>
        </div>
    )
}
