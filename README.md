<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://github.com/athrael-soju/iridium-ai/assets/25455658/f6c56b69-8960-4a00-819a-c700987b90c1" alt="Project logo"></a>
</p>

<h3 align="center">iridium-ai</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/athrael-soju/iridium-ai.svg)](https://github.com/athrael-soju/iridium-ai/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/athrael-soju/iridium-ai.svg)](https://github.com/athrael-soju/iridium-ai/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Iridium-AI is an Open Source application, heavily inspired by <a href ="https://github.com/pinecone-io/pinecone-vercel-starter" target="_blank">pinecone-vercel-starter</a>.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Setup](#setup)
- [Deployment](#deployment)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

Iridium-AI is based on <a href ="https://github.com/pinecone-io/pinecone-vercel-starter" target="_blank">pinecone-vercel-starter</a>, but adds several new features, such as:
- Multi-file Upload via [FilePond](https://www.npmjs.com/package/filepond).
- Bi-directional Audio via [Web-Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API).
- Extended web crawl functionality to allow custom URL's, or google search.
- Enhanced UI, for more chat screen space and the ability to Hide/show settings in both desktop & mobile view.

## 🏁 Getting Started <a name = "getting_started"></a>

All you need to get started is to create a new ```env.local``` file in the project root folder and add required values:
```

# Optional, defaults to gtp-3.5-turbo
OPENAI_API_MODEL=

# Required
OPENAI_API_KEY=

# Optional, defaults to text-embedding-ada-002
OPENAI_API_EMBEDDING_MODEL=

# Required
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX=

# Optional, defaults to 10
PINECONE_TOPK=10
```

See [deployment](#deployment) for notes on how to deploy the project on a live system.

## 🎈 Setup <a name="setup"></a>
Once you clone/fork the repo, you will need access to:
- OpenAI Account & API key
- Pinecone Account & API key

Then,

```
npm install
npm run dev
```

## 🚀 Deployment <a name = "deployment"></a>

You can use Vercel to deploy the application + add your environment variables in one click!

## ⛏️ Built Using <a name = "built_using"></a>

- [Next.js](https://www.mongodb.com/) - Front & Backend.
- [Vercel](https://vercel.com/) - Platform for Rapid build and deployment of web apps.
- [Pinecone](https://www.pinecone.io/) - Vector Database.
- [Langchain](https://python.langchain.com/docs/get_started/introduction) -  Framework for developing applications powered by language models

## ✍️ Authors <a name = "authors"></a>

- [@athrael-soju](https://github.com/athrael-soju) - Idea & Initial work


## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Huge thanks to the Pinecone Team for implementing <a href ="https://github.com/pinecone-io/pinecone-vercel-starter" target="_blank">pinecone-vercel-starter</a>, which Iridium-AI is based on.
