# scripts/backup.sh
#!/bin/bash
TIMESTAMP=$(date +"%F")
BACKUP_DIR="/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
pg_dump -U user -h localhost tpv > "$BACKUP_DIR/tpv.sql"# Configurar cron para ejecutar backup diario
crontab -e
# Añadir la siguiente línea para ejecutar el script de backup a las 2 AM todos los días
0 2 * * * /path/to/scripts/backup.sh