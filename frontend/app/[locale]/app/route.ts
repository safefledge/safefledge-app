import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await fetch("https://api.safefledge.com/v2/session/check");
  const session = await response.json();
  const url = new URL(request.url);
  const locale = url.pathname.split("/")[1];
  if (session.message === "Authorized") {
    url.pathname = url + "/home";
    return NextResponse.redirect(url.toString());
  } else if (session.message === "Unauthorized") {
    url.pathname = locale + "/auth/login";
    return NextResponse.redirect(url.toString());
  }
}
