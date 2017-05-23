{% if extends %}{% extends "styleguide/includes/base/masterpage.html" %}{% endif %}

        {% block content %}
        {% include "styleguide/includes/partials/moduleinfo.html" %}

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
