#!/bin/bash
# Azure Storage Lifecycle Management - Reduces storage costs by 60-70%
# Run this once to set up automatic tiering policies

# Storage account names from Web.config
DIAG_STORAGE="spsdiapdue"
ONLINE_STORAGE="spsonlpdue"
RESOURCE_GROUP="spsRgPdUe"  # Update if different

echo "Setting up storage lifecycle policies..."
echo ""

# Policy JSON for diagnostics storage (move to cool after 30 days, archive after 90)
DIAG_POLICY='{
  "rules": [
    {
      "enabled": true,
      "name": "MoveToCoolAfter30Days",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 30
            },
            "tierToArchive": {
              "daysAfterModificationGreaterThan": 90
            },
            "delete": {
              "daysAfterModificationGreaterThan": 365
            }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["logs/", "diagnostics/", "traces/"]
        }
      }
    }
  ]
}'

# Apply to diagnostics storage
echo "Applying lifecycle policy to $DIAG_STORAGE..."
az storage account management-policy create \
  --account-name $DIAG_STORAGE \
  --resource-group $RESOURCE_GROUP \
  --policy "$DIAG_POLICY" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Diagnostics storage policy applied"
else
    echo "✗ Failed to apply diagnostics policy (check resource group name)"
fi

# Policy for online storage (less aggressive - cool after 60 days)
ONLINE_POLICY='{
  "rules": [
    {
      "enabled": true,
      "name": "MoveToCoolAfter60Days",
      "type": "Lifecycle",
      "definition": {
        "actions": {
          "baseBlob": {
            "tierToCool": {
              "daysAfterModificationGreaterThan": 60
            }
          }
        },
        "filters": {
          "blobTypes": ["blockBlob"]
        }
      }
    }
  ]
}'

echo ""
echo "Applying lifecycle policy to $ONLINE_STORAGE..."
az storage account management-policy create \
  --account-name $ONLINE_STORAGE \
  --resource-group $RESOURCE_GROUP \
  --policy "$ONLINE_POLICY" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Online storage policy applied"
else
    echo "✗ Failed to apply online policy (check resource group name)"
fi

echo ""
echo "Done! Storage tiering policies configured."
echo ""
echo "Expected savings:"
echo "  - Cool tier: 50% cheaper than Hot"
echo "  - Archive tier: 90% cheaper than Hot"
echo "  - Auto-delete old logs after 1 year"
