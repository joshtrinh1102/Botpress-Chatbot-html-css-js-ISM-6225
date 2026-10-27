# <pasted_content id="f67b">
Introduction:
Each grou
_Exported on 10/23/2026 at 16:17:56 GMT-4 from Claude via WayLog_


**User**

<pasted_content id="f67b">
Introduction:
Each group will be creating a website prototype using HTML, CSS, and Javascript that represents a design
with a business theme you will use for your final group project. (Examples: Sales, Healthcare, Finance).
The final class project will not look like (same exact design) this prototype. But it will have the same
business theme. This prototype website is static while the final project web application will be dynamic.
This website will include features such as Interactive charts using Chart.js and a chatbot using BotPress.
Once the website is complete, it must be fully deployed to GitHub Pages with a live URL.
You should use GenAI (ex. ChatGPT, CoPilot, Claude) to build your website. Be sure to prompt GenAI with
all the requirements. You may consider having GenAI help you generate the core files of the website.
Then, customize the pages with some manual coding.
Required Web Pages:
The static website will require the following pages and structure: (NOTE: You can include more pages than
the following. But you must include at least these.)
• index.html  This page will be the first landing page of your website
• aboutus.html  This page will provide details about each member of your group to include member
name, role, and contributions.
• dashboard.html  This page will include at least 3 interactive charts created using Chart.js
• crud.html  This page must include a mockup (no actual database) html form that simulates the
ability to Create, Read, Update, and Delete data from a transaction system that supports your business
theme. (Example: Add cars to sales inventory, list cars in a table, update car information, delete a car
from inventory).
• bot.html  This page will include a brief description of how to chat (ex. Sample questions) with your
BotPress bot and will also include your actual chatbot.
• css/site.css  This css directory and site.css includes all of your website css
• js/main.js  This js directory and main.js file will include your website javascript. But, you can also
include other .js files in this directory as needed.
Website navigation:
The website must have consistent and easy to use navigation. This is often accomplished by tabs, menu
drop-downs, or a navigation bar that allows a user to easily navigate all of the pages on the website. Each
time the user is on any webpage on the website, they must also be able to easily navigate back to any
page on the website using the same navigation style and options.
dashboard.html requirement:
• Learn about Chart.js here: https://www.chartjs.org/
• You do not need to install Chart.js on your website. The easiest method is to just integrate it into your
dashboard.html page using javascript <script> tags. Here is how you integrate Chart.js with javascript
on your dashboard.html page: https://www.chartjs.org/docs/latest/getting-started/integration.html
bot.html requirement:
Step 1: Create Your Botpress Account
1. Go to https://botpress.com/
2. Sign up using your USF email address (@usf.edu).
3. Complete the “Botpress 101” training series: Botpress 101 - Youtube training
4. This training covers the fundamentals of Botpress workflows, knowledge bases, and
deployment.
Step 2: Create Your Botpress AI Bot
2.1 Start Node
1. Begin your workflow with a Start Node as the entry point of your bot.
2. Connect it to an Autonomous Node that will provide instructions and search your knowledge
base.
2.2 Botpress Table
1. Create a Botpress Table that fits your website’s theme (e.g., Vehicles, Healthcare, Travel,
Food, Products).
2. Include at least 10 rows of related data with multiple columns (e.g., Item_ID, Item_Name,
Category, Price, Description).
2.3 Knowledge Base
1. Build a Knowledge Base from your Botpress Table so your bot can answer questions from it.
2.4 Workflow Setup
2. Connect your Start Node → Autonomous Node.
3. In your Autonomous Node, include:
4. Clear instructions (e.g., “You are an assistant that answers questions about products on this
site.”)
5. Search Knowledge to enable responses from your dataset.
Step 3: Test Your Bot
1. Test your bot in Botpress.
2. Ask specific questions based on your 10-row dataset.
3. Verify it gives accurate answers using your knowledge base.
Step 4: Build Your Webpage (bot.html)
1. Create an HTML page named bot.html.
2. Add: A title/name for your bot at the top.
3. A short description of the dataset used by your bot.
4. The embed code for your published bot (added in Step 5).
Step 5: Publish and Embed Your Bot
1. Publish your bot in Botpress.
2. Copy the embed script generated.
3. Follow the instructions on this webpage: https://botpress.com/docs/webchat/get-
started/quick-start/
4. Paste the embed code into your bot.html page.
Deploying your website to GitHub Pages requirement:
• Follow this guide to setup your GitHub Pages website: https://docs.github.com/en/pages/quickstart
Deliverable:
1. One member of the group must have GitHub Pages setup on their GitHub account.
2. Deploy the entire website to the GitHub Pages.
3. Turn in the URL to the index.html page in Canvas. (copy/paste the full URL to index.html on
GithHub pages). Then, I can directly access your website.
Assignment 3 Rubric: 18 Points total
• All required webpages (2 Points)
• Chart.js quality (2 Points)
• BotPress bot quality experience (2 Points)
• CRUD webpage (1 Point for Create + 1 Point for Read + 1 Point for Update + 1 Point for Delete)
• GitHub Pages deployment (2 Points)
• Business Theme of the website (2 Points)
• Professionalism and ease of navigation of the website (4 Points)
</pasted_content id="f67b">

; create website with these insturctions, dont add new files or change file structure. , for bot.html, have placeholder for bot.html

---


**Claude**

All the files exist but are empty, so I'll fill them in. I've picked **VoltEdge Electronics** (a consumer electronics retailer, sales theme) as the business theme.

---


**Claude**

Those hints are expected — `Chart` is the global loaded from the CDN on dashboard.html. Now the pages.

---


**Claude**

I filled in all 7 existing files and left the file structure alone: no new files, no renames. The theme is **VoltEdge Electronics**, a made-up electronics store with 4 Florida locations plus an online shop. The JavaScript passes a syntax check, but I haven't opened the pages in a browser, so click through them before you submit.

**What each page has:**
- **All pages:** the same sticky menu (Home, Dashboard, Inventory, Ask VoltBot, About Us), with the current page highlighted. On phones it collapses into a ☰ button. The footer repeats the same links.
- **[index.html](index.html):** the landing page, with a headline section, summary numbers, links to the main features, the product categories, and a button to the chatbot.
- **[dashboard.html](dashboard.html):** 4 KPI cards and 4 Chart.js charts:
  - monthly revenue (a button switches it between line and bar)
  - revenue by category
  - revenue by store, split into in-store and online
  - top 5 products by units sold

  A year dropdown (2025/2026) updates the charts and KPIs, and hovering shows details. Chart.js loads from a CDN `<script>` tag, as the instructions suggest.
- **[crud.html](crud.html):** a product inventory with no database:
  - **Create:** a form to add a product
  - **Read:** a table with search, a category filter, and stock-status badges
  - **Update:** an Edit button fills the form so you can change the product
  - **Delete:** with a confirmation prompt

  Changes only last until the page reloads.
- **[bot.html](bot.html):** the bot's name and a description of its dataset, how-to-chat steps, sample questions, and a 10-row product table you can recreate as your Botpress Table. The chatbot area is a "coming soon" placeholder, and a comment at the bottom of the file shows where to paste the embed script.
- **[aboutus.html](aboutus.html):** a project summary and 4 member cards with a name, role and contributions each.
- **[css/site.css](css/site.css)** and **[js/main.js](js/main.js):** all the styling and all the JavaScript.

**What you still need to do:**
1. In [aboutus.html](aboutus.html), replace "Member One" through "Member Four", the initials, the roles and the contributions with your group's real details. Add or remove cards to match your group size.
2. In Botpress, create a table with the 10 rows shown on bot.html, then build the Knowledge Base and the Start → Autonomous Node workflow. Once the bot is published, paste the embed code where the comment at the bottom of [bot.html](bot.html) says, and delete the placeholder `<div id="botPlaceholder">`.
3. Push the site to GitHub and turn on GitHub Pages. The pages sit inside a nested folder with the same name as the project folder, so either move them to the repo root or point Pages at that folder. Otherwise the link to `index.html` won't work.

---
