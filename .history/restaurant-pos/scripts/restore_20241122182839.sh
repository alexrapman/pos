# scripts/restore.sh
#!/bin/bash
BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file>"
    exit 1
fi
psql -U user -h localhost tpv < "$BACKUP_FILE"