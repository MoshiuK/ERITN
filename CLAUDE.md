# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Access Management Website - a multi-tenant ASP.NET MVC 5 application for the TruEntry service provider platform. Each tenant is an access program (ERITN, CEAS, Rpath, Virginia, Washington, Utah, Iowa, Reentry) with separate branding, customers, and membership.

**Note**: This repository contains compiled/deployed files. Source C# files (.cs) are not included.

## Tech Stack

- ASP.NET MVC 5.3 / .NET Framework 4.7.2
- Entity Framework 6 with Azure SQL Server
- Azure AD B2C for authentication (OAuth/OpenID Connect via OWIN)
- Autofac for dependency injection
- TypeScript (ES5 target) and LESS for frontend
- Bootstrap 5, jQuery, Chart.js

## Build Commands

**TypeScript**: Compile using `tsconfig.json` (target: ES5, source maps enabled)

**LESS/CSS**: Compile using `compilerconfig.json` - contains 40+ theme compilation targets

**Required Tools**: Visual Studio with .NET Framework 4.7.2, LESS compiler, TypeScript compiler

## Architecture

### MVC Areas (Feature Modules)
- `Areas/Access/` - Credential search and queries
- `Areas/Administration/` - System admin, credentials, events, clearinghouse
- `Areas/Members/` - Member management
- `Areas/Operations/` - Internal staff functionality
- `Areas/Organizations/` - Org settings, coordinators, locations
- `Areas/Storefront/` - Customer-facing marketplace

### Core Assemblies
- `AccessManagement.Web.dll` - Main web application
- `AccessManagement.Framework.dll` - Business logic, multi-tenancy support
- `AccessManagement.Data.dll` - Entity Framework data layer

### Multi-Tenancy (Critical)

**Do not add tenant-specific controllers/views.** The main project handles all tenants with configuration-based customization. Tenant assemblies should only host custom code for paid consulting engagements.

**Tenant Discovery**: Autofac discovers tenant assemblies via `<juillet><discovery>` in Web.config. Each tenant needs a `Discoverable` class exported as `IModule`.

**Tenant Views**: `Mvc.TenantViewEngine` resolves views across tenant folders. Tenant assemblies registered with `BuildManager` via `PreApplicationStartInitializer.Initialize()`.

**Tenant Naming**: Use simple monikers (e.g., "Eritn" not "ER-ITN"). Folder, project, and assembly names must match.

### Frontend Structure

**JavaScript modules** in `Scripts/app/`:
- `AccessManagement.js` - Core framework
- `utils/HttpClient.js` - Promise-based XHR wrapper
- `administration/OrganizationApiClient.js`, `SettingsApiClient.js` - API clients

**Page scripts** in `Scripts/pages/` named by route: `administration.home.index.js`

**REST APIs**: `/viewapi/` prefix (e.g., `/viewapi/administration/organization/`)

### Theme System

Themes in `Content/theme/{tenant}/` with LESS files for each area (administration, storefront, access, organizations, members). Access via `ViewBag.Theme` or `Url.GetBrandUrlFor(User)`.

### Authentication

Four role-based sign-in flows in `Views/Authentication/`:
- Coordinator (Organization Admin)
- Tenant Administrator
- TruEntry Staff (Operations)
- Access Point Official

Cookie domain: `.truentry.net` (requires HTTPS)

## Key Configuration Files

- `Web.config` - Connection strings, app settings, assembly binding redirects, HTTPS enforcement, caching, compression
- `diagnostics.config` - Azure logging sinks and trace sources (set to Warning level)
- `compilerconfig.json` - LESS compilation targets (all with minification enabled)
- `tsconfig.json` - TypeScript compiler options
- `ApplicationInsights.config` - Telemetry with adaptive sampling (50% for dependencies)

## Deployment Scripts

### Before Production Deployment
```bash
./remove-source-maps.sh    # Removes ~6MB of .map files
```

### Azure Cost Optimization
```bash
./setup-storage-tiering.sh  # Sets up Cool/Archive tiering (saves 60-70%)
```

### Fix Password Expiration Issues
```bash
~/Desktop/fix-password-expired.sh admin@truentry.onmicrosoft.com
```

## Performance Optimizations Applied

- **HTTP Compression**: Enabled via `urlCompression` in Web.config
- **Static Caching**: 1-year cache for CSS/JS/fonts
- **Logging**: Reduced from Verbose to Warning (saves $200-400/mo)
- **App Insights Sampling**: 50% for dependencies (saves $150-300/mo)
- **WebJob Scheduling**: Runs every 5 minutes instead of continuously
- **CSS Minification**: All themes now minified
