// import { fetch, setGlobalDispatcher, Agent } from 'undici';
// import slugify from 'slugify';
import crypto from "crypto";
import jwt from "jsonwebtoken";
import environment from "../config/environment.js";
import { Registration } from "../../domain/entities/Registration.js";
import IOAuthManager from "../../interfaces/services/IOauthManager.js";
// setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }) )

export class LinkedInOAuthManager implements IOAuthManager {
  async getUser(code: string): Promise<Registration | null> {
    const query = new URLSearchParams();
    query.append("code", code);
    query.append("client_id", environment.LINKEDIN_CLIENT_ID);
    query.append("client_secret", environment.LINKEDIN_CLIENT_SECRET);
    query.append(
      "redirect_uri",
      `${environment.FRONTEND_URL}/onboarding/linkedin`
    );
    query.append("grant_type", "authorization_code");

    let accessToken = null;
    // let idToken = null;
    try {
      const res = await fetch(
        `https://www.linkedin.com/oauth/v2/accessToken?${query.toString()}`,
        // `https://www.linkedin.com/oauth/v2/authorization?${query.toString()}`,
        { method: "POST", headers: { Accept: "application/json" } }
      );
      const data = await res.json();
      // console.log(data);
      accessToken = data.access_token;
      // idToken = data.id_token;
    } catch (err) {
      console.error(err);
    }
    // todo: take data.scope and validate if it has read:email
    if (!accessToken) return null;
    let userData;
    try {
      const res = await fetch(
        "https://api.linkedin.com/v2/userinfo",
        { method: "GET", headers: { "Authorization": "Bearer " + accessToken } }
      );
      userData = await res.json();
      console.log(userData);
    } catch (err) {
      console.error(err);
      return null;
    }
    if (!userData) return null;

    const registration = new Registration({
      uuid: "<transient linkedIn oauth entity>",
      entity: "individual",
      role: "administrator",
      deviceId: "",
      locationId: "",
      networkId: "",
      needsApproval: false,
      requestedApproval: false,
      isApproved: true,
    });

    registration.email = {
      id: userData.email,
      isVerified: userData.email_verified,
    };

    registration.name = userData.name;

    return registration;
  }
}
