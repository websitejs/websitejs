{% if extends %}{% extends "styleguide/includes/layout.html" %}{% endif %}

        {% block content %}
        {% if name %}{% include "styleguide/includes/moduleinfo.html" %}{% endif %}

        <div class="container-fluid {{name}}">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12">
                        <h3>{{name}} component</h3>
                    </div>
                </div>
            </div>
        </div>

        {% endblock %}
