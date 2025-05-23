import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface LoginProps {
	heading?: string;
	subheading?: string;
	logo?: {
		url: string;
		src: string;
		alt: string;
	};
	loginText?: string;
	googleText?: string;
}

// Logo default
// {
//   url: "https://www.shadcnblocks.com",
//   src: "https://shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
//   alt: "Shadcnblocks",
// }

const Login = ({ heading = "Login", subheading = "Welcome back", loginText = "Log in", logo }: LoginProps) => {
	return (
		<section className="container flex flex-col gap-4">
			<div className="mx-auto w-full max-w-sm rounded-md p-6 shadow">
				<div className="mb-6 flex flex-col items-center">
					{logo ? (
						<a href={logo.url} className="mb-6 flex items-center gap-2">
							<Image src={logo.src} className="max-h-8" alt={logo.alt} />
						</a>
					) : (
						""
					)}
					<h1 className="mb-2 text-2xl font-bold">{heading}</h1>
					<p className="text-muted-foreground">{subheading}</p>
				</div>
				<div>
					<div className="grid gap-4">
						<Input type="email" placeholder="Enter your email" required />
						<div>
							<Input type="password" placeholder="Enter your password" required />
						</div>
						{/* <div className="flex justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    className="border-muted-foreground"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password
                </a>
              </div> */}
						<Button type="submit" className="mt-2 w-full">
							{loginText}
						</Button>
						{/* <Button variant="outline" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  {googleText}
                </Button> */}
					</div>
					{/* <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                <p>{signupText}</p>
                <a href={signupUrl} className="font-medium text-primary">
                  Sign up
                </a>
              </div> */}
				</div>
			</div>
		</section>
	);
};

export { Login };
