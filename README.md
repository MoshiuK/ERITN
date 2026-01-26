Access Management Website
=========================

This project is the core of the service provider suite pulling together all aspects of the service provider platform.

This is a multi-tenant website, where each tenant is a access program that is logically separated from all other access
programs, each with their own branding, customers and membership.

# Multi-tenancy Developer Notes

*This is critical reading for developers that want to understand, maintain or write new tenants.*

Although tenant assemblies are a convenient place to keep tenant specific code and assets, *do not* add tenant specific controllers
and views.  The main project is supposed to be a multi-tenant application that is capable of handling request for any and all tenants,
consistently and reliably and reusing code with appropriate configuration settings plugged in where customization is needed.
Every time we put code in a tenant specific that is proprietary to that tenant and increases testing and maintenance headache.

Tenant assemblies are capable of hosting controllers and view in case we need to, but this capability should only be used under
very considered circumstance. *The only reason we should use a tenant specific controller or view is because we've been 
paid to do that (e.g. as a consulting engagement or extra fee).*  An example of a legitimate use case is if a tenant pays for a 
custom report or custom API hook that other tenants do not need.

Prefer to make a reusable feature, adding the necessary abstractions to the ```AccessManagement.Framework``` project.

## Tenant Naming

Each tenant must have its own project under the *Tenants* folder, each project should be an ASP.NET MVC (Web) project.  

Use a simple moniker for the tenant project ("Eritn", not "ER-ITN"). The name of the folder is used to identify the tenant assembly 
as well as the folder, so be consistent: if the tenant is named 'TenantAbcDef' then the project/folder should be named 'TenantAbcDef' and 
the assembly in the 'TenantAbcDef\bin' folder should be named 'TenantAbcDef.dll'.

## Configuration

There are several aspects to configuring a tenant:
* Configuring Autofac to discover and load types from the tenant assembly.
* Configuring ASP.NET routes and how the appropriate Controller is loaded.
* Configuring ASP.NET Views in the tenant folder(s) and how they are compiled.

### Discovery

The project should include a ```Discoverable``` class that is exported as an ```IModule```.  Each folder must be added as an entry
in the ```<discovery>``` element of configuration in Web.config.

```
<juillet>
 <discovery>
  <add path=".\bin" />
  <add path=".\Tenants\TenantAbcDef\bin" />
 </discovery>
</juillet>
```

When the application starts discovery loads the module and registers any types in the assembly with the IoC container (Autofac).
Any MVC Controllers in the assembly are registered in this step.

We have to prevent assemblies being _discovered_ more than once so if a tenant shares dependencies with the main project, which it
certainly will for ```AccessManagement.Framework``` and ```AccessManagement.Data``` we have to explicitly set *Copy Local* to false
in the project references.

### Routes

Tenant projects can be treated just like any other MVC Area.  The project should have an ```AreaRegistration``` class that registers
its routes, the same as any other area.

When ```AreaRegistration.RegisterAllAreas()``` is called at application startup, the area is found and loaded just as though it 
were in the *AccessManagement.Web* project.

### Views

To ensure that ```.cshtml``` files are compiled properly we need to include the location of the views and update the assembly probing path
to include any dependencies.

The ```Mvc.TenantViewEngine``` class should already be set up to handle any new tenants, so long as the folder names and assembly names
match the pattern described before.  This lets the MVC runtime _find_ the .cshtml file.

We also need to configure MVC view compilation by providing additional information to the MVC ```BuildManager```.  The main assembly is 
already decorated with an ```PreApplicationStartMethodAttribute``` that calls ```PreApplicationStartInitializer.Initialize()``` *before* the 
application starts.  That initializer searches for each tenant assembly and explictly adds it as a reference to ```BuildManager```.

When ```BuildManager``` needs to compile the view (in response to someone navigating to an action in the tenant assembly) all the references
are already set up and the view compiles as normal.  With one exception... the dependencies of the tenant assemblies may not be available.

To ensure that any/all dependencies that the tenant assembly might have can be found, we update the ```Web.config``` to add a probing path that
includes the tenant ```.\bin``` folder.

```
<runtime>
  <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
    <probing privatePath="Tenants\Ceas\bin;Tenants\Eritn\bin"/>
	<!-- 
	   other binding configuration
	-->
  </assemblyBinding>
</runtime>
```

