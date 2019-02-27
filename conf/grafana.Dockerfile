FROM grafana/grafana:latest

COPY conf/grafana/grafana.ini /etc/grafana
COPY conf/grafana/datasources /etc/grafana/provisioning/datasources
COPY conf/grafana/dashboards /etc/grafana/provisioning/dashboards

EXPOSE 3000
