# Registration Service

## Entryway into Giggr | The creation of a Digital You

![PNPM](https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) <br/>
![Alpine Linux](https://img.shields.io/badge/Alpine_Linux-%230D597F.svg?style=for-the-badge&logo=alpine-linux&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white) ![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka) <br />
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

> [!IMPORTANT]
> **This project is currently under heavy development.**

**This repository** hosts the backend side of the registration part of Giggr, written using Node.js. The complexity of this unit demands it to be an individual service of a larger part of the microservices-based architecture. This service is containerized using [Docker](https://www.docker.com/) and orchestrated using [Kubernetes](https://kubernetes.io/) with [Apache Kafka](https://kafka.apache.org/) serving as the asynchronous message broker between services.

## 🪪 Registration

The underlying implementation of the registration flow would be a traditional form of inputs that needs to be filled with the following information. It is divided into multiple stages to not suffocate the user with too many fields, we can also save the data along each step in a transient database.

### Requirements

- **Platform Agnostic:** The process should be aware of and work across various devices and platforms, including desktops, smartphones, tablets, smart speakers, and even IoT devices. The user can access and/or resume the signup process from any device with internet connectivity.
- **Medium Agnostic:** The signup process should be able to consume and understand any medium of data it is given, for instance: users should be able to fill out the form through speech (voice), text (typing), file upload (relevant documents such as resume).
    - **Multi-Channel:** Whether users start the signup process through voice, text, or file upload, they should be able to seamlessly transition between mediums without losing progress or encountering inconsistencies in the information provided.
- **Channel Agnostic:** The registration process is shared and common for all stations of life, be it Environment, Education, Technology, Health, Wealth, Mobility, or Governance. It is the single point of entry into **Giggr**.

### Approaches

- **Conversational AI:** An experimental, but innovative approach is to fine tune a large language model or a design a dialog-flow in a way that it interacts with the user, and asks questions which the user can answer through text or voice. The assistant would understand, ask for clarification, and confirm the information in natural language.
- **Traditional Form:** The other, more straight-forward and perhaps even a faster approach for powerusers would be a multi-step form that with fields that prompts for input.

### 🧑 Individual

**Stage 1:**
- **Full Name:** An important information that we must keep, it needs to be validated to make sure that we have a first name and a last name, or initials.
- **Date of Birth:** This determines the age group, an underaged (< 18) user must go through an additional approval step where a guardian has to verify their account.

**Stage 1.5: (Optional, Guardian Approval):**
- **Full Name:** The name of the guardian or the parent.
- **Relation:** How the guardian is related to the dependent.
- **Email/Phone/Life ID:** The parent can enter one of the following identifiers, and the system will check whether an account already exists.
    - If already registered, we will send an approval request to the verified device, email, or phone number of the guardian.
    - If not registered, we will send a registration link to the email or phone number of the guardian. They may optionally be able to fill their information in the same device.
    - Once approved, they are also given an option to register an account as part of **Giggr**.

**Stage 2:**
- **Mobile Number:** To truly verify the identity of the user, we also require their mobile number. This must be verified using an OTP or a magic link.
- **Email Address:** Another important entry for identity verification is their email address. This must also be verified, but to reduce the friction for the user. We can mail them a magic link and have it also be their passwordless initial entry into their account.

**Stage 3:**
- **Location:** We can assume the location of the user through their mobile number, and their device location. We will need to confirm this information.
- **Metadata:** We will save metadata about the user's device and general information. This can help identify and associate the device which they used to register for the platform. We may ask for consent.

**Stage 4:** `[System]`
- **Life ID:** The system generates an universally unique identifier for the user at this stage.

### 🏭 Industry

*Yet to be filled.*

### 🏛️ Institute

*Yet to be filled.*

## 📦 Modules

- **Life ID Generation:** Every registered user must be assigned an universally unique identifier. This is currently planned to be a 16-digit numeric string.

## 🚀 Getting Started

*Setup information will be added shortly.*

## 📄 Confidentiality

Anything documented here is to be kept confidential and is property of Giggr Technologies Pvt Ltd.