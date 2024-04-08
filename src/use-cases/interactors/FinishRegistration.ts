import { IUseCase } from "../shared/IUseCase.js";
import StatusCode from "../shared/StatusCodes.js";
import { AppError } from "../shared/AppError.js";
import IRegistrationRepository from "../../interfaces/repositories/IRegistrationRepository.js";
import { IAccountIDGenerator } from "../../interfaces/services/IAccountIdGenerator.js";
import IGraphRepository from "../../interfaces/repositories/IGraphRepository.js";
import { BaseProfile } from "../../domain/entities/BaseProfile.js";
import { Organization } from "../../domain/entities/Organization.js";
import { IEmailService } from "../../interfaces/services/IEmailService.js";
import { ITokenGenerator } from "../../interfaces/services/ITokenGenerator.js";

export default class FinishRegistration implements IUseCase<Input, Output> {
  private readonly registrationRepository: IRegistrationRepository;
  private readonly accountIdGenerator: IAccountIDGenerator;
  private readonly graphRepository: IGraphRepository;
  private readonly emailService: IEmailService;
  private readonly tokenGenerator: ITokenGenerator;

  constructor({ registrationRepository, accountIdGenerator, graphRepository, emailService, tokenGenerator }: Dependencies) {
    this.registrationRepository = registrationRepository;
    this.accountIdGenerator = accountIdGenerator;
    this.graphRepository = graphRepository;
    this.emailService = emailService;
    this.tokenGenerator = tokenGenerator;
  }

  async execute({ signupId }: Input): Promise<Output> {
    const registration = await this.registrationRepository.findByUUID(signupId);
    if (!registration || registration.giggrId) {
      throw new AppError("No registration found", StatusCode.NOT_FOUND);
    }

    if (
      !registration.name ||
      !registration.dateOfBirth ||
      !registration.email ||
      !registration.phone
    ) {
      throw new AppError("All fields are not filled.", StatusCode.BAD_REQUEST);
    }

    if (!registration.email.isVerified) {
      throw new AppError("Email id is not verified.", StatusCode.BAD_REQUEST);
    }

    if (!registration.phone.isVerified) {
      throw new AppError(
        "Phone number is not verified.",
        StatusCode.BAD_REQUEST
      );
    }

    if (!registration.approval.isApproved) {
      throw new AppError(
        `Awaiting approval from ${registration.approval!.isFrom}.`,
        StatusCode.BAD_REQUEST
      );
    }

    // Industry/Institute Logic
    if (registration.entity !== "individual") {
      console.log("Industrial logic needs to run");
    }

    const giggrId = await this.accountIdGenerator.generate();

    registration.giggrId = giggrId;

    // urgent fixme: Send email after registration.

    const updation = await this.registrationRepository.merge(registration);
    if (updation != StatusCode.OK) {
      throw new AppError(
        "Could not update database.",
        StatusCode.INTERNAL_ERROR
      );
    }

    let res;
    if (registration.role === "administrator") {
      // const organization = new Organization({})
      // res = await this.graphRepository.createOrganization(organization);
      // if (res !== StatusCode.CREATED) {
      //   throw new AppError("Could not create graph node", res);
    }

    // if (registration.role === "user") {

      const baseProfileData = {
        entity: registration!.entity,
        role: registration!.role,
        locationId: registration!.metadata!.locationId,
        networkId: registration!.metadata!.networkId,
        deviceId: registration!.metadata!.deviceId,
        name: registration!.name,
        email: registration!.email!.id || "",
        phone: registration!.phone!.number || "",
        dateOfBirth: registration!.dateOfBirth,
        giggrId: registration!.giggrId,
      };
      const individualNode = new BaseProfile(baseProfileData);
      res = await this.graphRepository.createBaseProfile(individualNode);
      if (res !== StatusCode.CREATED) {
        throw new AppError("Could not create graph node", res);
      }

    // }

    const accessTokenPayload = { access: true, giggrId: registration.giggrId };
    const accessToken = this.tokenGenerator.generate(accessTokenPayload);

    const portalLink = `https://web.giggr.app/onboarding/entry/${accessToken}`;

    const emailStatus = await this.emailService.sendEmail(
      registration.email.id ?? "",
      "Welcome to a Digital You | Giggr",
`<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Signup to Giggr</title>
  <style>
@media only screen and (max-width: 620px) {
  table[class=body] h1 {
    font-size: 28px !important;
    margin-bottom: 10px !important;
  }

  table[class=body] p,
table[class=body] ul,
table[class=body] ol,
table[class=body] td,
table[class=body] span,
table[class=body] a {
    font-size: 16px !important;
  }

  table[class=body] .wrapper,
table[class=body] .article {
    padding: 10px !important;
  }

  table[class=body] .content {
    padding: 0 !important;
  }

  table[class=body] .container {
    padding: 0 !important;
    width: 100% !important;
  }

  table[class=body] .main {
    border-left-width: 0 !important;
    border-radius: 0 !important;
    border-right-width: 0 !important;
  }

  table[class=body] .btn table {
    width: 100% !important;
  }

  table[class=body] .btn a {
    width: 100% !important;
  }

  table[class=body] .img-responsive {
    height: auto !important;
    max-width: 100% !important;
    width: auto !important;
  }
}
@media all {
  .ExternalClass {
    width: 100%;
  }

  .ExternalClass,
.ExternalClass p,
.ExternalClass span,
.ExternalClass font,
.ExternalClass td,
.ExternalClass div {
    line-height: 100%;
  }

  .apple-link a {
    color: inherit !important;
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    text-decoration: none !important;
  }

  .btn-primary table td:hover {
    background-color: #d5075d !important;
  }

  .btn-primary a:hover {
    background-color: #d5075d !important;
    border-color: #d5075d !important;
  }
}
</style></head>
  <body class style="background-color: #eaebed; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background-color: #eaebed; width: 100%;" width="100%" bgcolor="#eaebed">
      <tr>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
        <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; Margin: 0 auto;" width="580" valign="top">
          <div class="header" style="padding: 20px 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;">
              <tr>
                <td class="align-center" width="100%" style="font-family: sans-serif; font-size: 14px; vertical-align: top; text-align: center;" valign="top" align="center">
                  <a href="https://giggr.app" style="color: #ec0867; text-decoration: underline;"><img src="https://static.wixstatic.com/media/465d69_bd1fd426d94a49248b6956b93eb0a9b1~mv2.png" height="40" alt="Postdrop" style="border: none; -ms-interpolation-mode: bicubic; max-width: 100%;"></a>
                </td>
              </tr>
            </table>
          </div>
          <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Your Giggr ID has been provisioned.</span>
            <table role="presentation" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; background: #ffffff; border-radius: 3px; width: 100%;" width="100%">

              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;" valign="top">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">Hello %name%,</p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">You have been generated a unique ID for Giggr Platform.</p>
                        <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">✨&nbsp; The following ID is unique and personal to you, forever. Please ensure that you keep it safe.</p>
                        <h2 style="color: #06090f; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px; text-align: center;">%id%</h2>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; box-sizing: border-box; width: 100%;" width="100%">
                          <tbody>
                            <tr>
                              <td align="center" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;" valign="top">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: auto; width: auto;" width="auto">
                                  <tbody>
                                    <tr>
                                      <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; border-radius: 5px; text-align: center; background-color: #ec0867;" valign="top" align="center" bgcolor="#ec0867"> <a href="%url%" target="_blank" style="border: solid 1px #ec0867; border-radius: 5px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-decoration: none; text-transform: capitalize; background-color: #ec0867; border-color: #ec0867; color: #ffffff;">Enter My Portal</a> </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; width: 100%;" width="100%">
                <tr>
                  <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                    <span class="apple-link" style="color: #9a9ea6; font-size: 12px; text-align: center;"><a href="mailto:mail@giggr.app" style="text-decoration: underline; color: #9a9ea6; font-size: 12px; text-align: center;">mail@giggr.app</a></span>
                    <br><a href="https://giggr.app" style="text-decoration: underline; color: #9a9ea6; font-size: 12px; text-align: center;">Giggr Technologies</a>
                  </td>
                </tr>
                <tr>
                  <td class="content-block powered-by" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #9a9ea6; font-size: 12px; text-align: center;" valign="top" align="center">
                    This email is sent as your entryway into the Giggr Platform.
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;" valign="top">&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`.replace("%id%", registration.giggrId).replace("%name%", registration.name).replace("%url%", portalLink)
    );


    return { message: "Account has been created.", giggrId: giggrId };
  }
}

interface Dependencies {
  registrationRepository: IRegistrationRepository;
  accountIdGenerator: IAccountIDGenerator;
  graphRepository: IGraphRepository;
  emailService: IEmailService;
  tokenGenerator: ITokenGenerator;
}

interface Input {
  signupId: string;
}

interface Output {
  message: string;
  giggrId: string;
}
