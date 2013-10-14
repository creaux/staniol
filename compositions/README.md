What are compositions
---------------------

Folder called compositions contains modules (folders) which represent specific stylesheets composition for specific layout.

Why we are saving compositions in Staniol?
------------------------------------------

It's more than needed to use these compositions via more than one project. We have two approaches 1) represent column html approch where we giving for each column specific class (.col-1, .col-2 ... .col-12) in each .row wrapper. Second one approach is just like component. We are creating semantic classes like .header, .section, .footer and each of them has assigned mixin with specific number of columns.