# AI-Powered Thinkific Curriculum Bridge

A custom AI integration that connects ChatGPT with live Thinkific course content using MCP, REST, GraphQL, and Cloudflare Workers.

## The Problem

I wanted to use AI to review, improve, and eventually help develop online curriculum stored in Thinkific. The existing workflow required manually copying course material out of Thinkific, working with it in ChatGPT, and then transferring the results back.

The goal was simple from a user perspective:

**Let ChatGPT securely access the curriculum already stored in Thinkific.**

## The Challenge

Thinkific provided API access to courses, chapters, lessons, and other curriculum information. Initial testing with the REST API successfully retrieved the course structure and lesson metadata.

However, the REST endpoint I was using did not return the actual body of text-based lessons.

That meant the integration could identify a lesson but could not retrieve the curriculum inside it.

## The Investigation

Rather than abandoning the integration, I investigated Thinkific's other supported API options.

Thinkific's GraphQL schema exposed the text lesson content I needed through `TextContent` and `htmlDescription`.

Testing confirmed that GraphQL could retrieve the full lesson body.

This created a new design:

- REST API for course structure and lesson metadata
- GraphQL API for richer lesson content
- A custom MCP server to expose these capabilities as tools ChatGPT could use

## The Solution

I built a private MCP integration hosted on Cloudflare Workers.

The final workflow is:

**User → ChatGPT → MCP Server → Thinkific APIs → Thinkific Classroom**

Rather than requiring the AI to manage separate REST and GraphQL workflows, I upgraded the existing content-retrieval tool so it could use both APIs behind the scenes.

The user can simply request a lesson. The integration determines how to retrieve the information needed.

## Problem Solving in Practice

The project involved several iterations:

1. Tested an existing integration and determined it did not provide the curriculum access required.
2. Connected directly to Thinkific's REST API.
3. Successfully retrieved courses, chapters, lessons, and metadata.
4. Identified that the REST content response did not include the full text lesson body needed for this use case.
5. Investigated Thinkific's GraphQL schema.
6. Confirmed that GraphQL exposed the required text lesson content.
7. Added GraphQL support to the custom MCP server.
8. Encountered a tool-discovery issue when adding a separate MCP function.
9. Redesigned the approach by enhancing the existing content tool instead.
10. Successfully retrieved live lesson content through ChatGPT.

## Result

The working integration allows ChatGPT to retrieve live Thinkific curriculum, including:

- Courses
- Chapters
- Lessons
- Lesson metadata
- Full text lesson content

This provides the foundation for AI-assisted curriculum review, course redesign, and future controlled content-management capabilities.

## Technologies

- ChatGPT
- Model Context Protocol (MCP)
- Thinkific
- REST APIs
- GraphQL
- Cloudflare Workers
- JavaScript
- JSON
- API authentication

## Security

The production integration uses private credentials and protected endpoints.

This public repository is a sanitized portfolio version. It does **not** contain API tokens, authentication credentials, private endpoint URLs, learner information, or proprietary curriculum content.

## Future Development

Potential future development includes:

- Controlled curriculum editing
- Human approval before write operations
- AI-assisted course creation
- Additional lesson-type support
- Separate limited-access tools for learner-facing AI assistance

## About This Project

This project demonstrates my approach to AI solution design: start with the real-world problem, understand how the systems communicate, test the available paths, identify limitations, and adapt the architecture until the workflow works for the people using it.
