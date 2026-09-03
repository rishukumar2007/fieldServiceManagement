package com.KEYSTONE.fieldServiceManagement.dto;

import com.KEYSTONE.fieldServiceManagement.model.Part;
import java.math.BigDecimal;

public class PartDto {
    private String id;
    private String name;
    private String sku;
    private BigDecimal unitCost;
    private Integer stockQty;

    public PartDto() {
    }

    public PartDto(String id, String name, String sku, BigDecimal unitCost, Integer stockQty) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.unitCost = unitCost;
        this.stockQty = stockQty;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String id;
        private String name;
        private String sku;
        private BigDecimal unitCost;
        private Integer stockQty;

        public Builder id(String id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder sku(String sku) { this.sku = sku; return this; }
        public Builder unitCost(BigDecimal unitCost) { this.unitCost = unitCost; return this; }
        public Builder stockQty(Integer stockQty) { this.stockQty = stockQty; return this; }

        public PartDto build() {
            return new PartDto(id, name, sku, unitCost, stockQty);
        }
    }

    public static PartDto fromEntity(Part part) {
        if (part == null) return null;
        return PartDto.builder()
                .id(part.getId())
                .name(part.getName())
                .sku(part.getSku())
                .unitCost(part.getUnitCost())
                .stockQty(part.getStockQty())
                .build();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public BigDecimal getUnitCost() { return unitCost; }
    public void setUnitCost(BigDecimal unitCost) { this.unitCost = unitCost; }

    public Integer getStockQty() { return stockQty; }
    public void setStockQty(Integer stockQty) { this.stockQty = stockQty; }
}
