function Footer() {
	return (
		<footer className="w-full pb-4 border-t bg-background z-10 ">
			<div className="container px-4 py-8 mx-auto">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{/* Company Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">TravelGenie</h3>
						<p className="text-sm text-muted-foreground">
							Wish. Pack. Go.
						</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="/page/dashboard"
									className="text-sm text-muted-foreground hover:text-primary"
								>
									Dashboard
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://ravish-ranjan.github.io"
									className="text-sm text-muted-foreground hover:text-primary"
								>
									Portfolio
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Contact Me</h3>
						<ul className="space-y-2">
							<li className="text-sm text-muted-foreground">
								<a href="mailto:ravishranjan2003@gmail.com">
									Contant via mail
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
export default Footer;
