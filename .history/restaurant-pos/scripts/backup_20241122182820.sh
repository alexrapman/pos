# scripts/backup.sh
#!/bin/bash
TIMESTAMP=$(date +"%F")
BACKUP_DIR="/backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
pg_dump -U user -h localhost tpv > "$BACKUP_DIR/tpv.sql"